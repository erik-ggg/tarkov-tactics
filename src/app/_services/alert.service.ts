import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class AlertService {
    private subject = new Subject<any>();
    private keepAfterNavigationChange = false;

    constructor(private router: Router) {
        // clear alert message on route change
        router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                if (this.keepAfterNavigationChange) {
                    // only keep for a single location change
                    this.keepAfterNavigationChange = false;
                } else {
                    // clear alert
                    this.subject.next();
                }
            }
        });
    }

    success(message: string, keepAfterNavigationChange = false) {
        this.throwMessage(message, keepAfterNavigationChange, 'success');
    }

    error(message: string, keepAfterNavigationChange = false) {
        this.throwMessage(message, keepAfterNavigationChange, 'error');
    }

    private throwMessage(message: string, keepAfterNavigationChange = false, msgType: string): void {
        this.keepAfterNavigationChange = keepAfterNavigationChange;
        this.subject.next({ type: msgType, text: message });
        setTimeout(() => {
            this.subject.next();
        }, 5000)
    }

    getMessage(): Observable<any> {
        return this.subject.asObservable();
    }
}