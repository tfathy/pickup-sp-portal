import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';

@Component({
  selector: 'app-search-toolbar',
  templateUrl: './search-toolbar.component.html',
  styleUrls: ['./search-toolbar.component.scss'],
})
export class SearchToolbarComponent implements OnInit {
  @Input() title='enter title here';
  @Input() listOfValues =[];
  showSearchbar = false;
  ios: boolean;
  queryText = '';
  constructor(private router: Router) { }

  ngOnInit() {}
  returnToHome(){
    this.router.navigate(['/','landing']);
  }
  returnBack(){
    this.router.navigate(['/','setup-home']);
  }
  onCancelSearch() {
    of(false).subscribe(
      (data) => {
        console.log(data);
        this.showSearchbar = data;
      },
      (error) => {
        console.log(error);
      }
    );
  }
  findRecord(event) {
    const query = event.detail.value;
    console.log(query);
    let filteredData;
    if (!query) {
      this.ngOnInit();
    } else {
      filteredData = this.listOfValues.filter(
        (row) =>
          row.compNameE.toLocaleLowerCase().indexOf(query.toLocaleLowerCase()) >
          -1
      );

      return of(filteredData).subscribe(
        (data) => {
          this.listOfValues = data;
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

}
