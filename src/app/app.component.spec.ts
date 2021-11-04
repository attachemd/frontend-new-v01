import { Router } from '@angular/router';
import { AppComponent } from './app.component';
import {ComponentFixture, TestBed} from "@angular/core/testing";
import {HomeComponent} from "./home/home.component";
import {NO_ERRORS_SCHEMA} from "@angular/compiler";


describe('App Component', () => {
    // let component: AppComponent;
    // let fixture: ComponentFixture<AppComponent>;
    // beforeEach(async() => {
    //     // component = new AppComponent(new Router())
    //     await TestBed.configureTestingModule({
    //         declarations: [ AppComponent ],
    //         providers: [ Router ],
    //         schemas: [NO_ERRORS_SCHEMA]
    //     }).compileComponents();
    // });
    //
    // beforeEach(() => {
    //     fixture = TestBed.createComponent(AppComponent);
    //     component = fixture.componentInstance;
    //     fixture.detectChanges();
    // });

    it('should 1 + 1', () => {
        expect(1 + 1).toEqual(2);
    });

    it('should have a component', () => {

        // expect(component).toBeTruthy();
    });
});
