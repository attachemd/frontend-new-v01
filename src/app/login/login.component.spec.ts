// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { Router } from '@angular/router';
// import { LoginComponent } from './login.component';
// import { RouterTestingModule } from '@angular/router/testing';
// import {Observable, of} from "rxjs";
// import {AuthService} from "../services/auth.service";
// import {NO_ERRORS_SCHEMA} from "@angular/core";
//
// const authServiceMock = {
//     userLogin(data: any): Observable<any> {
//         return of([{id:'1', username:'Test'}]);}
// };
//
// describe('MyComponent', () => {
//
//     // let component: LoginComponent;
//     // let fixture: ComponentFixture<LoginComponent>;
//     // let router: Router;
//     // let authService: AuthService;
//
//
//
//     // imports: [
//     //     RouterTestingModule.withRoutes([])
//     // ]
//     // beforeEach(() => {
//     //     fixture = TestBed.createComponent(MyComponent);
//     //     router = TestBed.inject(Router);
//     //     component = fixture.componentInstance;
//     //     fixture.detectChanges();
//     // });
//
//     // beforeEach(() => {
//     //     TestBed.configureTestingModule({
//     //         declarations: [
//     //             LoginComponent,
//     //             // FavoriteIconDirective,
//     //             // InvalidEmailModalComponent,
//     //             // InvalidPhoneNumberModalComponent
//     //         ],
//     //         imports: [
//     //             // AppMaterialModule,
//     //             // FormsModule,
//     //             // NoopAnimationsModule,
//     //             RouterTestingModule.withRoutes([]),
//     //         ],
//     //         providers: [
//     //             { provide: authService, useValue: authServiceMock }
//     //         ],
//     //         schemas: [ NO_ERRORS_SCHEMA ]
//     //     });
//     // });
//     //
//     // beforeEach(() => {
//     //     fixture = TestBed.createComponent(LoginComponent);
//     //     router = TestBed.inject(Router);
//     //     authService = TestBed.inject(AuthService);
//     //     component = fixture.componentInstance;
//     //     fixture.detectChanges();
//     // });
//     //
//     // it('userLogin test case ', () => {
//     //     // spyOn(authService, 'userLogin').and.returnValue([{id:'2', username:'TestWithDifferentObject'}]);
//     //     const spy = spyOn(authService, 'userLogin').and.callThrough();
//     //     authService.userLogin({username:"me", password:"1234"});
//     //     expect(spy).toHaveBeenCalled();
//     //     expect(component.data).toBe({id:'1', username:'Test'});
//     // });
//
//     let authService: AuthService;
//     let loginSpy: Jasmine;
//     let component: LoginComponent;
//     let fixture: ComponentFixture<LoginComponent>;
//
//     beforeEach(() => {
//         TestBed.configureTestingModule({
//             imports: [
//                 ReactiveFormsModule,
//                 FormsModule,
//                 HttpModule,
//                 RouterTestingModule
//             ],
//             declarations: [LoginComponent],
//             providers: [AuthService],
//         });
//         fixture = TestBed.createComponent(LoginComponent);
//         component = fixture.componentInstance;
//         component.ngOnInit();
//     });
//
//     it('should call auth login method', async(() => {
//         let loginElement: DebugElement;
//         const debugElement = fixture.debugElement;
//         authService = debugElement.injector.get(AuthService);
//         loginSpy = spyOn(authService , 'loginByUsernameAndPassword').and.callThrough();
//         loginElement = fixture.debugElement.query(By.css('form'));
//         // to set values
//         component.loginForm.controls['username'].setValue('user');
//         component.loginForm.controls['password'].setValue('123');
//         loginElement.triggerEventHandler('ngSubmit', null);
//         expect(loginSpy).toHaveBeenCalledTimes(1); // check that service is called once
//     }));
//
// });

import { LoginComponent } from "./login.component";
import { async, ComponentFixture, fakeAsync, TestBed, tick } from "@angular/core/testing";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { blankUser, validUser } from "../../mocks";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { AuthService } from "../services/auth.service";
import { Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { of } from "rxjs";

const routerSpy = jasmine.createSpyObj("Router", ["navigateByUrl"]);
const authServiceSpy = jasmine.createSpyObj("AuthService", ["userLogin"]);

const testUserData = { id: 1, username: "TekLoon" };
const loginErrorMsg = "Invalid Login";

describe("Login Component Isolated Test", () => {
    let component: LoginComponent;

    beforeEach(async(() => {
        component = new LoginComponent(routerSpy, new FormBuilder(), authServiceSpy);
    }));

    function updateForm(userEmail: string, userPassword: string) {
        component.loginForm.controls["username"].setValue(userEmail);
        component.loginForm.controls["password"].setValue(userPassword);
    }

    it("Component successfully created", () => {
        expect(component).toBeTruthy();
    });

    it("component initial state", () => {
        expect(component.submitted).toBeFalsy();
        expect(component.loginForm).toBeDefined();
        expect(component.loginForm.invalid).toBeTruthy();
        expect(component.authError).toBeFalsy();
        expect(component.authErrorMsg).toBeUndefined();
    });

    it("submitted should be true when onSubmit()", () => {
        component.onSubmit(blankUser);
        expect(component.submitted).toBeTruthy();
        expect(component.authError).toBeFalsy();
    });

    it("form value should update when u change the input", (() => {
        updateForm(validUser.username, validUser.password);
        expect(component.loginForm.value).toEqual(validUser);
    }));

});

describe("Login Component Shallow Test", () => {

    let fixture: ComponentFixture<LoginComponent>;

    function updateForm(userEmail: string, userPassword: string) {
        fixture.componentInstance.loginForm.controls["username"].setValue(userEmail);
        fixture.componentInstance.loginForm.controls["password"].setValue(userPassword);
    }

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                BrowserAnimationsModule,
                ReactiveFormsModule,
                MatFormFieldModule,
                MatIconModule,
                MatInputModule
            ],
            providers: [
                {
                    provide: AuthService,
                    useValue: authServiceSpy
                },
                FormBuilder,
                {
                    provide: Router,
                    useValue: routerSpy
                }
            ],
            declarations: [LoginComponent]
        }).compileComponents();
        fixture = TestBed.createComponent(LoginComponent);
    }));

    it("created a form with username and password input and login button", () => {
        // const fixture = TestBed.createComponent(LoginComponent);
        const usernameContainer = fixture.debugElement.nativeElement.querySelector("#username-container");
        const passwordContainer = fixture.debugElement.nativeElement.querySelector("#password-container");
        const loginBtnContainer = fixture.debugElement.nativeElement.querySelector("#login-btn-container");
        expect(usernameContainer).toBeDefined();
        expect(passwordContainer).toBeDefined();
        expect(loginBtnContainer).toBeDefined();
    });

    it("Display Username Error Msg when Username is blank", () => {
        updateForm(blankUser.username, validUser.password);
        fixture.detectChanges();

        const button = fixture.debugElement.nativeElement.querySelector("button");
        button.click();
        fixture.detectChanges();

        const usernameErrorMsg = fixture.debugElement.nativeElement.querySelector("#username-error-msg");
        expect(usernameErrorMsg).toBeDefined();
        expect(usernameErrorMsg.innerHTML).toContain("Please enter username");
    });

    it("Display Password Error Msg when Username is blank", () => {
        updateForm(validUser.username, blankUser.password);
        fixture.detectChanges();

        const button = fixture.debugElement.nativeElement.querySelector("button");
        button.click();
        fixture.detectChanges();

        const passwordErrorMsg = fixture.debugElement.nativeElement.querySelector("#password-error-msg");
        expect(passwordErrorMsg).toBeDefined();
        expect(passwordErrorMsg.innerHTML).toContain("Please enter password");
    });

    it("Display Both Username & Password Error Msg when both field is blank", () => {
        updateForm(blankUser.username, blankUser.password);
        fixture.detectChanges();

        const button = fixture.debugElement.nativeElement.querySelector("button");
        button.click();
        fixture.detectChanges();

        const usernameErrorMsg = fixture.debugElement.nativeElement.querySelector("#username-error-msg");
        const passwordErrorMsg = fixture.debugElement.nativeElement.querySelector("#password-error-msg");

        expect(usernameErrorMsg).toBeDefined();
        expect(usernameErrorMsg.innerHTML).toContain("Please enter username");

        expect(passwordErrorMsg).toBeDefined();
        expect(passwordErrorMsg.innerHTML).toContain("Please enter password");
    });

    it("When username is blank, username field should display red outline ", () => {
        updateForm(blankUser.username, validUser.password);
        fixture.detectChanges();
        const button = fixture.debugElement.nativeElement.querySelector("button");
        button.click();
        fixture.detectChanges();

        const inputs = fixture.debugElement.nativeElement.querySelectorAll("input");
        const usernameInput = inputs[0];

        expect(usernameInput.classList).toContain("is-invalid");
    });

    it("When password is blank, password field should display red outline ", () => {
        updateForm(validUser.username, blankUser.password);
        fixture.detectChanges();
        const button = fixture.debugElement.nativeElement.querySelector("button");
        button.click();
        fixture.detectChanges();

        const inputs = fixture.debugElement.nativeElement.querySelectorAll("input");
        const passwordInput = inputs[1];

        expect(passwordInput.classList).toContain("is-invalid");
    });

});

describe("Login Component Integrated Test", () => {
    let fixture: ComponentFixture<LoginComponent>;
    let loginSpy;

    function updateForm(userEmail: string, userPassword: string) {
        fixture.componentInstance.loginForm.controls["username"].setValue(userEmail);
        fixture.componentInstance.loginForm.controls["password"].setValue(userPassword);
    }

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule,
                BrowserAnimationsModule,
                ReactiveFormsModule,
                MatFormFieldModule,
                MatIconModule,
                MatInputModule
            ],
            providers: [
                {
                    provide: AuthService,
                    useValue: authServiceSpy
                },
                FormBuilder,
                {
                    provide: Router,
                    useValue: routerSpy
                }
            ],
            declarations: [LoginComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(LoginComponent);
        // router = TestBed.get(Router);

        loginSpy = authServiceSpy.userLogin.and.returnValue(of(testUserData));

    }));

    it(
        "authService userLogin() should be called ",
        fakeAsync(() => {
            updateForm(validUser.username, validUser.password);
            fixture.detectChanges();
            const button = fixture.debugElement.nativeElement.querySelector("button");
            button.click();
            fixture.detectChanges();

            expect(authServiceSpy.userLogin).toHaveBeenCalled();
        })
    );

    it(
        "should route to dashboard if userLogin successfully",
        fakeAsync(() => {
            updateForm(validUser.username, validUser.password);
            fixture.detectChanges();
            const button = fixture.debugElement.nativeElement.querySelector("button");
            button.click();
            advance(fixture);

            loginSpy = authServiceSpy.userLogin.and.returnValue(of(testUserData));
            advance(fixture);

            expect(routerSpy.navigateByUrl).toHaveBeenCalled();
            const navArgs = routerSpy.navigateByUrl.calls.first().args[0];
            console.log('navArgs: ', navArgs);
            expect(navArgs).toBe("/dashboard", "should nav to dashboard Page");
        })
    );

    function advance(f: ComponentFixture<any>) {
        tick();
        f.detectChanges();
    }

});
