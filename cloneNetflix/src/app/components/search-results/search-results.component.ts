import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MovieWithTrailer } from 'src/app/interface/movie-with-trailer.interface';
import { MoviesService } from 'src/app/services/movies.service';
import { MovieModalComponent } from '../movie-modal/movie-modal.component';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss']
})
export class SearchResultsComponent implements OnInit {
  searchQuery: string = '';
  searchResults: any[] = [];
  selectedMovie?: MovieWithTrailer;
  isModalOpen = false;

  constructor(private route: ActivatedRoute, private moviesService: MoviesService,    private modalService:NgbModal
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['query'];
      this.fetchSearchResults();
    });
  }

  fetchSearchResults() {
    if (this.searchQuery) {
      this.moviesService.searchMovies(this.searchQuery).subscribe((response: any) => {
        this.searchResults = response.results;
      });
    }
  }

  openModal(movie: MovieWithTrailer): void {
    // this.selectedMovie = movie;
    // this.isModalOpen = true;
    let modale=this.modalService.open(MovieModalComponent,{size:'lg',centered:true})
    modale.componentInstance.movie=movie;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedMovie = undefined;
  }
}
