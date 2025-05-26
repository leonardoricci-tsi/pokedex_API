import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PokeAPIService } from '../services/poke-api.service';

@Component({
  standalone: true,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [CommonModule, FormsModule]
})
export class HomeComponent implements OnInit {
  listaPokemons: any[] = [];
  pokemonsFiltrados: any[] = [];

  termoBusca: string = '';

  paginaAtual: number = 1;
  itensPorPagina: number = 20;
  totalPaginas: number = 1;


  tipoSelecionado: string = '';
  todosTipos: string[] = [];

  private apiUrlImage = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';

  constructor(private pokeApiService: PokeAPIService) { }

  ngOnInit(): void {
    this.getPokemons();
  }

  getPokemons(): void {
    this.pokeApiService.getAllPokemon().subscribe(response => {
      const lista = response.results.map((pokemon: any, index: number) => ({
        ...pokemon,
        id: index + 1,
        type: ''
      }));

      const promises = lista.map((poke: any) =>
        this.pokeApiService.getPokemonByName(poke.name)
      );

      Promise.all(promises).then(detalhes => {
        detalhes.forEach((info, i) => {
          lista[i].types = info.types.map((t: any) => t.type.name);
          lista[i].stats = info.stats;
          lista[i].flipped = false;
          lista[i].height = info.height;
          lista[i].weight = info.weight;

        });

        this.listaPokemons = lista;
        this.totalPaginas = Math.ceil(this.listaPokemons.length / this.itensPorPagina);
        this.filtrarPokemons();
        this.todosTipos = Array.from(new Set(lista.flatMap((p: any) => p.types))) as string[];



      });

    });

  }

  getPokemonImageUrl(id: number): string {
    return `${this.apiUrlImage}/${id}.png`;
  }

  filtrarPokemons(): void {
    const termo = this.termoBusca.toLowerCase();
    const tipo = this.tipoSelecionado;

    const listaFiltrada = this.listaPokemons.filter(p => {
      const nomeOk = p.name.toLowerCase().includes(termo);
      const tipoOk = tipo ? p.types.includes(tipo) : true;
      return nomeOk && tipoOk;
    });

    this.totalPaginas = Math.ceil(listaFiltrada.length / this.itensPorPagina);
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    const fim = this.paginaAtual * this.itensPorPagina;
    this.pokemonsFiltrados = listaFiltrada.slice(inicio, fim);
  }

  proximaPagina(): void {
    if (this.paginaAtual < this.totalPaginas) {
      this.paginaAtual++;
      this.filtrarPokemons();
    }
  }

  paginaAnterior(): void {
    if (this.paginaAtual > 1) {
      this.paginaAtual--;
      this.filtrarPokemons();
    }
  }

  getGradientePorTipos(tipos: string[]): string {
    const cores: { [key: string]: string } = {
      fire: '#FF7043',
      water: '#42A5F5',
      grass: '#66BB6A',
      electric: '#FFD54F',
      psychic: '#BA68C8',
      ice: '#81D4FA',
      dragon: '#9575CD',
      dark: '#8D6E63',
      fairy: '#F48FB1',
      normal: '#BDBDBD',
      fighting: '#E57373',
      flying: '#90CAF9',
      poison: '#CE93D8',
      ground: '#A1887F',
      rock: '#AAB6FE',
      bug: '#D4E157',
      ghost: '#B39DDB',
      steel: '#90A4AE'
    };

    const cor1 = cores[tipos[0]] || '#E0E0E0';
    const cor2 = tipos[1] ? (cores[tipos[1]] || '#E0E0E0') : cor1;

    return `linear-gradient(135deg, ${cor1}, ${cor2})`;
  }
  virarCard(poke: any): void {
    poke.flipped = !poke.flipped;
  }


}
