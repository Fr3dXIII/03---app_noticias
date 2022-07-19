import { Component, OnInit } from '@angular/core';
import { NewsResponse, Article } from '../../interfaces/index';
import { NewsService } from '../../services/news.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  public articles: Article[] = [];

  constructor(
    private newService: NewsService
  ) {}

  ngOnInit(): void {
     this.newService.getTopHeadLines()
        .subscribe(articles => this.articles = articles);
  } //end onInit



}//end class
