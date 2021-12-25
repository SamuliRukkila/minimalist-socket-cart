import { Component } from "@angular/core"
import {TranslateService} from "@ngx-translate/core"

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  title: string

  constructor(private translate: TranslateService) {
    translate.setDefaultLang("fi")
    this.translate.get("title").subscribe((value: string) => this.title = value)
  }
}
