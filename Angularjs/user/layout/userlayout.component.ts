import { Component } from "@angular/core";

@Component({
    template: `
        <header-component></header-component>
        <sidebar-component></sidebar-component>
        <div class="content-wrapper">
            <router-outlet></router-outlet>
        </div>
        <footer-component></footer-component>
    `,
    styles: []
})
export class UserLayoutComponent {

}