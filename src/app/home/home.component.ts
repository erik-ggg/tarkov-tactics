import { Component, OnInit, AfterViewInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { Observable } from 'rxjs-compat';

import { User } from '../_models';
import { UserService } from '../_services';

@Component({ templateUrl: 'home.component.html', styleUrls: ['./home.component.css'] })
export class HomeComponent implements OnInit, AfterViewInit {
    insertingMultimedia = false;
    canvas: HTMLCanvasElement;
    canvasRedoState: string[]; // redo states
    canvasState: string[]; // undo states
    color: HTMLInputElement;
    context: CanvasRenderingContext2D;
    currentUser: User;

    constructor(private userService: UserService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

    ngOnInit() {
        this.canvas = <HTMLCanvasElement>document.getElementById('mapCanvas');
        this.canvasRedoState = new Array();
        this.canvasState = new Array();
        this.context = this.canvas.getContext('2d');
        this.color = <HTMLInputElement>document.getElementById('colorInput');
    }
    ngAfterViewInit(): void {
        this.captureEvents(this.canvas, this.color);
    }

    public loadWoods() {
        const img = <HTMLImageElement>document.getElementById('mapImage');
        img.hidden = false;
        img.src = '../../assets/img/woods_map.jpg';
        const self = this;
        img.onload = function () {
            if (img.complete) {
                self.canvas.height = img.height;
                self.canvas.width = img.width;
                document.getElementById('toolbar').hidden = false;
                document.getElementById('container').hidden = false;
            }
        };
    }

    public loadCustoms() {
        const img = <HTMLImageElement>document.getElementById('mapImage');
        img.src = '../../assets/img/customs_map.jpg';
        const self = this;
        img.onload = function () {
            if (img.complete) {
                self.canvas.height = img.height;
                self.canvas.width = img.width;
            }
        };
    }

    public loadShoreline() {
        const img = <HTMLImageElement>document.getElementById('mapImage');
        img.src = '../../assets/img/shoreline_map.jpg';
        const self = this;
        img.onload = function () {
            if (img.complete) {
                self.canvas.height = img.height;
                self.canvas.width = img.width;
            }
        };
    }

    /**
     * Make bigger the canvas brush
     */
    public enlarge() {
        this.context.lineWidth++;
    }

    public shrink() {
        this.context.lineWidth--;
    }

    public undo() {
        // if canvas has states we can undo
        if (this.canvasState.length > 1) {
            const img = new Image;
            this.canvasRedoState.push(this.canvasState.pop()); // saving state for redo
            // loading previous state
            if (this.canvasState.length > 0) { img.src = this.canvasState[this.canvasState.length - 1]; }
            const self = this;
            img.onload = function () {
                if (img.complete) {
                    self.context.clearRect(0, 0, self.canvas.width, self.canvas.height);
                    self.context.drawImage(img, 0, 0);
                    console.log(self.canvasState.length);
                }
            };
        } else {
            // if is the first state, clear the canvas and save the state
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.canvasRedoState.push(this.canvasState.pop());
        }
    }

    public redo() {
        // if we did undo we can do redo
        if (this.canvasRedoState.length > 0) {
            const img = new Image;
            img.src = this.canvasRedoState.pop();
            this.canvasState.push(img.src);
            const self = this;
            img.onload = function () {
                if (img.complete) {
                    self.context.clearRect(0, 0, self.canvas.width, self.canvas.height);
                    self.context.drawImage(img, 0, 0);
                }
            };
        }
    }

    public save() {

    }

    private captureEvents(canvas: HTMLCanvasElement, color: HTMLInputElement) {
        // detects changes in the color input
        // and change the canvas line color
        Observable
            .fromEvent(color, 'input')
            .subscribe(() => {
                this.context.strokeStyle = color.value;
            });

        Observable
            .fromEvent(canvas, 'mousedown')
            .switchMap((e) => {
                return Observable
                    .fromEvent(canvas, 'mouseup');
            })
            .subscribe((res: MouseEvent) => {
                if (this.insertingMultimedia) {
                    this.drawMultimedia(res, canvas);
                } else {
                    this.canvasState.push(this.canvas.toDataURL()); // save new canvas states
                }
            });

        Observable
            .fromEvent(canvas, 'mousedown')
            .switchMap((e) => {
                return Observable
                    .fromEvent(canvas, 'mousemove')
                    .takeUntil(Observable.fromEvent(canvas, 'mouseup'))
                    .takeUntil(Observable.fromEvent(canvas, 'mouseleave'))
                    .pairwise();
            })
            .subscribe((res: [MouseEvent, MouseEvent]) => {
                this.draw(res, canvas);
            });
    }

    /**
     * Draws a line starting on the user first click
     * and finishing when the user release the left mouse button
     * @param res the server response
     * @param canvas the canvas element
     */
    private draw(res: [MouseEvent, MouseEvent], canvas: HTMLCanvasElement) {
        const rect = canvas.getBoundingClientRect();
        const prevPos = {
            x: res[0].clientX - rect.left,
            y: res[0].clientY - rect.top
        };
        const currentPos = {
            x: res[1].clientX - rect.left,
            y: res[1].clientY - rect.top
        };
        this.drawOnCanvas(prevPos, currentPos, canvas);
    }

    private drawOnCanvas(prevPos: any, currentPos: any, canvas: HTMLCanvasElement): any {
        const context = canvas.getContext('2d');
        if (!context) { return; }

        context.beginPath();

        if (prevPos) {
            context.moveTo(prevPos.x, prevPos.y);
            context.lineTo(currentPos.x, currentPos.y);
            context.stroke();
        }
    }

    /**
     * TODO: finish this method
     * Creates a button icon in the place where users clicks
     * @param res
     * @param canvas
     */
    private drawMultimedia(res: MouseEvent, canvas: HTMLCanvasElement) {
        const rect = canvas.getBoundingClientRect();
        const prevPos = {
            x: res.clientX - rect.left,
            y: res.clientY - rect.top
        };

        const multimediaImage = new Image();
        multimediaImage.src = '../assets/images/video_cursor.png';
        // canvas.getContext('2d').drawImage(multimediaImage, prevPos.x, prevPos.y);
        const button = document.createElement('BUTTON');
        button.id = 'prueba';
        button.setAttribute('style', 'top:' + prevPos.y + 'px;left:' + prevPos.x + 'px;');
        button.appendChild(document.createTextNode('PRUEBA'));
        document.body.appendChild(button);
        this.insertingMultimedia = false;
        document.body.style.cursor = 'default';
    }

    /**
     * Changes the cursor icon to the video icon
     */
    public changeCursorVideo() {
        document.body.style.cursor = 'url(./assets/images/video_cursor.png), auto';
        this.insertingMultimedia = true;
    }
}
