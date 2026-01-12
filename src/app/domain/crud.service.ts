import { inject } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  docData,
  DocumentReference,
  Firestore,
  getDoc,
  getDocs,
  query,
  QueryConstraint,
  updateDoc,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface BaseModel {
  id: string;
  toJson(): any;
}

export abstract class CrudService<T extends BaseModel> {
  protected firestore = inject(Firestore);

  private listCache = new Map<string, T[]>();
  private itemCache = new Map<string, T>();

  /**
   * The path to the collection in Firestore.
   */
  protected abstract path: string;

  /**
   * Domain object builder.
   */
  protected abstract fromJson(json: any): T;

  /**
   * Returns the collection reference.
   */
  protected get collection() {
    return collection(this.firestore, this.path);
  }

  /**
   * Gets all documents from the collection as a single promise.
   * @param constraints Optional Firestore query constraints (where, orderBy, limit, etc.)
   */
  async list(constraints: QueryConstraint[] = []): Promise<T[]> {
    const cacheKey = this.path + JSON.stringify(constraints);
    if (this.listCache.has(cacheKey)) {
      return this.listCache.get(cacheKey)!;
    }

    const q = query(this.collection, ...constraints);
    const querySnapshot = await getDocs(q);
    const results = querySnapshot.docs.map(
      (doc) => this.fromJson({ id: doc.id, ...doc.data() }),
    );

    this.listCache.set(cacheKey, results);
    return results;
  }

  /**
   * Gets all documents from the collection as an observable.
   * @param constraints Optional Firestore query constraints (where, orderBy, limit, etc.)
   */
  list$(constraints: QueryConstraint[] = []): Observable<T[]> {
    const q = query(this.collection, ...constraints);
    return (collectionData(q, { idField: 'id' }) as Observable<any[]>).pipe(
      map((items) => items.map((item) => this.fromJson(item))),
    );
  }

  /**
   * Gets a single document by ID as a single promise.
   * @param id The document ID.
   */
  async get(id: string): Promise<T | undefined> {
    if (this.itemCache.has(id)) {
      return this.itemCache.get(id);
    }

    const docRef = doc(this.firestore, `${this.path}/${id}`);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const result = this.fromJson({ id: docSnap.id, ...docSnap.data() });
      this.itemCache.set(id, result);
      return result;
    }
    return undefined;
  }

  /**
   * Gets a single document by ID as an observable.
   * @param id The document ID.
   */
  get$(id: string): Observable<T | undefined> {
    const docRef = doc(this.firestore, `${this.path}/${id}`);
    return (docData(docRef, { idField: 'id' }) as Observable<any>).pipe(
      map((item) => (item ? this.fromJson(item) : undefined)),
    );
  }

  /**
   * Creates a new document in the collection.
   * @param item The item to add.
   */
  async create(item: Omit<T, 'id'>): Promise<DocumentReference<T>> {
    const data = (item as any).toJson ? (item as any).toJson() : item;
    // We remove the 'id' field if it exists to let Firestore generate one
    const { id, ...cleanData } = data;
    const docRef = await addDoc(this.collection, cleanData);
    this.listCache.clear();
    return docRef as DocumentReference<T>;
  }

  /**
   * Updates an existing document.
   * @param id The document ID.
   * @param item The partial data to update.
   */
  async update(id: string, item: Partial<T>): Promise<void> {
    const docRef = doc(this.firestore, `${this.path}/${id}`);
    const data = (item as any).toJson ? (item as any).toJson() : item;
    const { id: _, ...cleanData } = data;
    await updateDoc(docRef, cleanData);
    this.itemCache.delete(id);
    this.listCache.clear();
  }

  /**
   * Deletes a document by ID.
   * @param id The document ID.
   */
  async delete(id: string): Promise<void> {
    const docRef = doc(this.firestore, `${this.path}/${id}`);
    await deleteDoc(docRef);
    this.itemCache.delete(id);
    this.listCache.clear();
  }
}
