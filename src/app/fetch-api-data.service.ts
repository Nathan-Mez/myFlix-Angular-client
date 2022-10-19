
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/internal/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

//Declaring the api url that will provide data for the client app
const apiUrl = 'https://grandflix.herokuapp.com/';

const token = localStorage.getItem('token');
// Get username from localStorage for URLs
const username = localStorage.getItem('username');

@Injectable({
  providedIn: 'root'
})
export class FetchApiDataService {

  constructor(private http: HttpClient) { }

  /**
   * @service POST to an API endpoint to register a new user
   * @param userDetails 
   * @returns a new user object in json format
   * @function userRegistration
   */
  public userRegistration(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http
      .post(apiUrl + 'users', userDetails)
      .pipe(catchError(this.handleError));
  }

  /**
   * @service POST to an API endpoint to log a user in
   * @param userCredentials 
   * @returns user data in json format
   * @function userLogin
   */
  public userLogin(userCredentials: any): Observable<any> {
    console.log(userCredentials);
    return this.http
      .post(apiUrl + 'login', userCredentials)
      .pipe(catchError(this.handleError));
  }


  /**
   *  @service GET to an API endpoint to get all movies
   * @returns array of movies in json format
   * @function getAllMovies
   */
  getAllMovies(): Observable<any> {
    const username = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + 'movies', {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * @service GET to an API endpoint to get a specific movie info
   * @param title 
   * @returns data of one movie
   * @function getSingleMovie
   */
  getSingleMovie(title: any): Observable<any> {
   
    return this.http
      .get(apiUrl + `movies/${title}`, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        })
      })
      .pipe(
        map(this.extractResponseData),
        catchError(this.handleError)
      );
  }

  /**
   * @service GET to an API endpoint to get a specific director info
   * @param name 
   * @returns data of director
   * @function getDirector
   */
  getDirector(name: any): Observable<any> {
   
    return this.http
      .get(apiUrl + `movies/director/${name}`, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        })
      })
      .pipe(
        map(this.extractResponseData),
        catchError(this.handleError)
      );
  }


 /**
   * @service GET to an API  endpoint to get data about genres
   * @returns an array of genres in json format
   * @function getGenres
   */
getGenres(): Observable<any> {
  
  return this.http
    .get( apiUrl + 'genre', {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    })
    .pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
}

  /**
   * @service GET to an API endpoint to get data about a specific user
   * @returns a user in json format
   * @function getUser
   */
  getUser(): Observable<any> {
    const username = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + 'users/' + username, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        })
      })
      .pipe(
        map(this.extractResponseData),
        catchError(this.handleError)
      );
  }
  
  /**
   * @service PUT to an API endpoint to add a movie to the favourite list array
   * @param movieId 
   * @returns a user in json format
   * @function addFavoriteMovie
   */
  addFavoriteMovie( movieId: any): Observable<any> {
    const username = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    return this.http
      .post(apiUrl + `users/${username}/${movieId}`,{},   {
        headers: new HttpHeaders({
          Authorization: `Bearer ${token}`,
        })
      })
      .pipe(
        map(this.extractResponseData),
        catchError(this.handleError)
      );
  }

 /**
  * @service DELETE to an API endpoint to remove a movie to the favourite list array
  * @param movieID 
  * @returns none
  * @function removeFavoriteMovie
  * 
  */
  removeFavoriteMovie(movieID: any): Observable<any> {
    const username = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    return this.http
      .delete(apiUrl + `users/${username}/${movieID}`, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        })
      })
      .pipe(
        map(this.extractResponseData),
        catchError(this.handleError)
      );
  }

  /**
   * @service PUT to an API endpoint to update one or multiple data of a user
   * @param updateDetails 
   * @returns a user in json format
   * @function editUser
   */
editUser(updateDetails: any): Observable<any> {
  const username = localStorage.getItem('user');
  const token = localStorage.getItem('token');
  console.log(updateDetails)
    return this.http
      .put(apiUrl + `users/${username}`, updateDetails, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        })
      })
      .pipe(
        map(this.extractResponseData),
        catchError(this.handleError)
      );
  }

  /**
   * @service DELETE to an API endpoint to remove a user
   * @returns none
   * @function deleteUser
   */
  deleteUser(): Observable<any> {
    const username = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    return this.http
      .delete(apiUrl + `users/${username}`, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  private extractResponseData(res: any): any {
    const body = res;
    return body || {};
  }


  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('Some error occurred:', error.error.message);
    } else {
      console.log(error);
      console.error(
        `Error Status code ${error.status}, Error body is: ${error.error}`
      );
      console.table(error);
    }
    throwError(
      () => new Error('Something bad happened; please try again later.')
    );
  }
}