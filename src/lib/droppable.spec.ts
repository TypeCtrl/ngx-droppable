/* tslint:disable:no-any */
import { Component, ViewChild } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';

import { DroppableModule } from '../lib/public_api';
import { DroppableDirective } from './droppable.directive';

@Component({
  selector: 'test-droppable',
  template: `<div
    droppable
    #droppable="droppable"
    (filesDropped)="handleFilesDropped($event)"
    [acceptsMultipleFiles]="acceptsMultipleFiles"
    [appendStatusClasses]="appendStatusClasses"
    [accept]="accept"
  ></div> `,
  exportAs: 'test-droppable',
})
export class TestComponent {
  @ViewChild('droppable', { static: true }) droppable!: DroppableDirective;
  acceptsMultipleFiles = true;
  appendStatusClasses = true;
  accept: string | false = '.jpg';
  files: File[] = [];
  handleFilesDropped(files: File[]): void {
    this.files = files;
  }
}

describe('Droppable', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [DroppableModule],
    }).compileComponents();
  }));
  it('should create', async(() => {
    const fixture = TestBed.createComponent(TestComponent);
    const tc: TestComponent = fixture.debugElement.componentInstance;
    expect(tc).toBeTruthy();
  }));
  it('should return an HTMLInputElement of type file and display none', async(() => {
    const fixture = TestBed.createComponent(TestComponent);
    const tc: TestComponent = fixture.debugElement.componentInstance;
    const inputElement = tc.droppable.makeVirtualInputElement();
    expect(inputElement instanceof HTMLInputElement).toBe(true);
    expect(inputElement.type).toBe('file');
    expect(inputElement.style.display).toBe('none');
  }));
  it('should set the tabindex attribute of the given element to 0', async(() => {
    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    const nc = fixture.debugElement.nativeElement;
    expect(nc.querySelector('div').tabIndex).toBe(0);
  }));
  it('should add the role attribute to the given element', async(() => {
    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    const nc = fixture.debugElement.nativeElement;
    expect(nc.querySelector('div').getAttribute('role')).toBe('button');
  }));
  it('should trigger a click on the virtualInputElement', async(() => {
    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    const tc: TestComponent = fixture.debugElement.componentInstance;
    const mock = spyOn((tc.droppable as any).virtualInputElement, 'click');
    tc.droppable.promptForFiles();
    expect(mock).toHaveBeenCalled();
  }));
  it('should set multiple', async(() => {
    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    const tc: TestComponent = fixture.debugElement.componentInstance;
    expect(
      (tc.droppable as any).virtualInputElement.getAttribute('multiple')
    ).toBe('true');
  }));
  it('should remove multiple', async(() => {
    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    const tc: TestComponent = fixture.debugElement.componentInstance;
    tc.acceptsMultipleFiles = false;
    fixture.detectChanges();
    expect(
      (tc.droppable as any).virtualInputElement.getAttribute('multiple')
    ).toBe(null);
  }));
  it('should set accepted', async(() => {
    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    const tc: TestComponent = fixture.debugElement.componentInstance;
    expect(
      (tc.droppable as any).virtualInputElement.getAttribute('accept')
    ).toBe('.jpg');
  }));
  it('should remove accepted', async(() => {
    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    const tc: TestComponent = fixture.debugElement.componentInstance;
    tc.accept = false;
    fixture.detectChanges();
    expect(
      (tc.droppable as any).virtualInputElement.getAttribute('accept')
    ).toBe(null);
  }));
  describe('handleDragover(event)', () => {
    let fakeEvent: any;

    beforeEach(() => {
      fakeEvent = {
        preventDefault: jasmine.createSpy('spy'),
        stopPropagation: jasmine.createSpy('spy'),
      };
    });

    it('should add the dragOverClass to the element', async(() => {
      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
      const tc: TestComponent = fixture.debugElement.componentInstance;
      const nc = fixture.debugElement.nativeElement;
      tc.droppable.handleDragover(fakeEvent);
      expect(
        nc.querySelector('div').classList.contains(tc.droppable.dragOverClass)
      ).toBe(true);
      expect(fakeEvent.preventDefault).toHaveBeenCalled();
      expect(fakeEvent.stopPropagation).toHaveBeenCalled();
      tc.droppable.handleDragleave(fakeEvent);
      expect(
        nc.querySelector('div').classList.contains(tc.droppable.dragOverClass)
      ).toBe(false);
    }));
    it('should not add the dragOverClass to the element when appendStatusClasses is false', async(() => {
      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
      const tc: TestComponent = fixture.debugElement.componentInstance;
      tc.appendStatusClasses = false;
      fixture.detectChanges();
      const nc = fixture.debugElement.nativeElement;
      tc.droppable.handleDragover(fakeEvent);
      expect(
        nc.querySelector('div').classList.contains(tc.droppable.dragOverClass)
      ).toBe(false);
      expect(fakeEvent.preventDefault).toHaveBeenCalled();
      expect(fakeEvent.stopPropagation).toHaveBeenCalled();
      tc.droppable.handleDragleave(fakeEvent);
      expect(
        nc.querySelector('div').classList.contains(tc.droppable.dragOverClass)
      ).toBe(false);
    }));
  });
});
