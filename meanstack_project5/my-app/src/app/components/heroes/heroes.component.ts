import { Component, OnInit } from '@angular/core';
import { Hero } from '../../classes/hero';
import { HeroService } from '../../services/hero.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {
  heroes : Hero[];
  selectedHero : Hero;

  constructor(private heroService : HeroService,
              private router : Router) {}

  ngOnInit() : void {
    this.getHeroes();
  }

  onSelect (hero : Hero) : void {
    this.selectedHero = hero;

  }
  getHeroes() {
    // heroService는 Promise를 리턴한다. 그러나 then 안에서는 데이터들은 raw로 된다.
    //this.heroService.getHeroes().then(heroes => this.heroes = heroes);
    this.heroService.getHeroes().then(heroes => this.heroes = heroes);
  }

  gotoDetail() {
    this.router.navigate(['/detail', this.selectedHero.id]);
  }
}
