import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';

import { NewsResponse, Article,ArticlesByCategoryAndPage  } from '../interfaces';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';



const apiKey = environment.apiKey;
const apiUrl = environment.apiUrl;


@Injectable({
  providedIn: 'root'
})
export class NewsService  { 

  private articlesByCategoryAndPage: ArticlesByCategoryAndPage = {};
  

  constructor(public http:HttpClient) { }

    private executeQuery<T>( endpoint: string ) {
      console.log('Petición HTTP realizada');
      return this.http.get<T>(`${ apiUrl }${ endpoint }`, {
        params: {
          apiKey:apiKey,
          country: 'us',
        }
      });
    }

    getTopHeadLines(): Observable<Article[]>{
      return this.http.get<NewsResponse>(`https://newsapi.org/v2/everything`,
        {
          params: {
            q:'videogames',
            from : '2022-07-05',
            sortBy:'publishedAt',
            apiKey : apiKey
          }
        })
        .pipe(
          //map(resp => (resp.articles )) abajo solo elijo articles
          map( ({articles}) => articles)
        );

        //return this.getTopHeadlinesByCategory('business');
    }


    getTopHeadlinesByCategory( category:string, loadmore: boolean = false ) :Observable<Article[]>{

      //--- Si no existe devuelve la categoria -----------------------------------------------------
      if(loadmore){
        this.getArticlesByCategory(category);
      }

      //--- Si existe categoria devuelve el articulo convertido en Observable gracias a (of) -------
      if (this.articlesByCategoryAndPage[category]) {
        return of(this.articlesByCategoryAndPage[category].articles);
      }

      //--- Si no existe categoria devuelve los articulos ------------------------------------------
      return this.getArticlesByCategory(category);

      /* return this.http.get<NewsResponse>(`https://newsapi.org/v2/top-headlines`,
      {
        params: {
          country:'ar',
          category: category,          
          apiKey : apiKey
        }
      })
      .pipe(        
        map( ({articles}) => articles)
      ); */
    }


    private getArticlesByCategory(category:string):Observable<Article[]> {

      //--- Controla si estan o no los articulos ------------------------
      if( Object.keys( this.articlesByCategoryAndPage ).includes(category) ) {
        //Si existe no hace nada 
      } else {
        //No existe los agrega al array ----------------------------------
        this.articlesByCategoryAndPage[category] = {
          page : 0,
          articles: []
        }
      }//end if


      const page = this.articlesByCategoryAndPage[category].page + 1;

      return this.executeQuery<NewsResponse>(`/top-headlines?category=${ category }&page=${ page }&country=ar`)
        .pipe(
          map(( { articles } ) =>  {

            if( articles.length === 0) return this.articlesByCategoryAndPage[category].articles;

            this.articlesByCategoryAndPage[category] = {
              page: page,
              articles: [...this.articlesByCategoryAndPage[category].articles, ...articles] 
            }

            return this.articlesByCategoryAndPage[category].articles;
          })
        );

    }//end function 


}