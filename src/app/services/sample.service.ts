import {Injectable} from "@angular/core";
import {Subject} from "rxjs";

@Injectable()
export class SampleService {
  notify: Subject<boolean> = new Subject<boolean>();
  onNotify(event:any) {
    this.notify.next(true);
  }
}
