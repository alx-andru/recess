import {Component, Input, Output, EventEmitter, SimpleChanges} from '@angular/core';

@Component({
  selector: 'ui-tooltip',
  templateUrl: 'ui-tooltip.html'
})
export class UiTooltipComponent {

  @Input()
  value: number;

  @Input()
  timestamp: any;

  @Input()
  index: number;

  @Input()
  isDay:boolean;

  @Input()
  isSteps:boolean;

  private timeouts: any[] = [];

  @Output() vanished = new EventEmitter();

  constructor() {
    console.log('Hello UiTooltip Component');
  }

  ngOnChanges(changes: SimpleChanges) {
    for (let propName in changes) {
      let chng = changes[propName];
      let cur = JSON.stringify(chng.currentValue);
      let prev = JSON.stringify(chng.previousValue);
      //console.log(`${propName}: currentValue = ${cur}, previousValue = ${prev}`);

      //if(cur!==prev && cur !== undefined){
        this.hideTooltip();
      //}


    }
  }

  /**
   * A tooltip is shown and automatically dissapears after 2s. To prevent quick clicks from clearing,
   * a list of timeouts is maintained and cleared before an new one is added.
   * @param idx
   */
  public hideTooltip() {
    console.log('onchange');
    this.vanished.emit(this.index); // keep selection
    // clear timeout from previous click, otherwise new value will be closed right away
    for (let timeout in this.timeouts) {
      clearTimeout(this.timeouts[timeout]);
    }

    let timeout = setTimeout(() => {
      //this.index = 0;
      //this.value = undefined;
      //delete this.value;
      //this.timestamp = undefined;
      this.vanished.emit(); // vanish everything
    }, 2000);

    this.timeouts.push(timeout);
  }

}
