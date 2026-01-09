import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccordionModule } from 'primeng/accordion';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { Listbox } from 'primeng/listbox';

interface City {
    name: string,
    code: string
}

@Component({
  selector: 'app-list',
  imports: [FormsModule, AccordionModule, AvatarModule, BadgeModule, ButtonModule, Listbox],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class List implements OnInit {
    cities!: City[];

    selectedCity!: City;

    ngOnInit() {
        this.cities = [
            { name: 'usuario1@gmail.com', code: '1' },
            { name: 'usuario2@gmail.com', code: '2' },
            { name: 'usuario3@gmail.com', code: '3' },
            { name: 'usuario4@gmail.com', code: '4' },
            { name: 'usuario5@gmail.com', code: '5' },
            { name: 'usuario6@gmail.com', code: '6' },
            { name: 'usuario7@gmail.com', code: '7' },
        ];
    }
}
