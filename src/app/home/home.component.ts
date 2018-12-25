import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { map } from 'rxjs/operators';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public key: string;
  public showUrlMessage: boolean;
  public url: string;

  constructor(private route: ActivatedRoute, private router: Router) {
    this.key = null;
    this.showUrlMessage = false;
    this.url = document.location.href;
  }

  ngOnInit() {
    this.route.paramMap.pipe(map((params: ParamMap) => params.get('key')))
      .subscribe(key => {
        this.key = key;
        if (key) {
          this.showUrlMessage = true;
        }
      });
  }

  public onTodoListCreated(key: string) {
    this.router.navigate(['/', key]);
  }
}
