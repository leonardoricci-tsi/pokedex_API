import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PokeAPIService {
  private baseUrl = 'https://pokeapi.co/api/v2/pokemon';

  constructor(private http: HttpClient) {}

  // Pega a lista de pokémons com nome e URL (limitado a 200)
  getAllPokemon(): Observable<any> {
    return this.http.get(`${this.baseUrl}?limit=200`);
  }

  // Pega detalhes de um pokémon específico (inclui tipo, stats, etc.)
  getPokemonByName(name: string): Promise<any> {
    return fetch(`https://pokeapi.co/api/v2/pokemon/${name}`).then(res => res.json());
  }

  
}

