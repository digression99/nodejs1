import { Injectable } from '@angular/core';
import { Hero } from '../classes/hero';
import { HEROES } from '../data/mock-heroes';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class HeroService {

  private heroesUrl = 'api/heroes';

  constructor(private http : Http) { }

  getHeroes() : Promise<Hero[]> {
    return this.http.get(this.heroesUrl).toPromise().then(
      response =>response.json().data as Hero[]).catch(this.handleError);
  }

  private handleError(error :any) : Promise<any> {
    console.error('an error occured.', error);
    return Promise.reject(error.message || error);
  }


  // getHeroes() : Promise<Hero[]> {
  //   return Promise.resolve(HEROES);
  // }

  getHeroesSlowly(): Promise<Hero[]> {
    return new Promise(resolve => {
      // Simulate server latency with 2 second delay
      setTimeout(() => resolve(this.getHeroes()), 2000);
    });
  }

  getHero(id : number) : Promise<Hero> {
    return this.getHeroes()
      .then(heroes => heroes.find(hero => hero.id === id));
  }

}
