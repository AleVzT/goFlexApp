import { Component, OnInit, Input } from '@angular/core';
import { Offers, WareHouse } from '../../interfaces/block.interface';
import { FlexServices } from '../../services/flex.service';
import { map, pipe } from 'rxjs';

@Component({
  selector: 'block-card',
  templateUrl: './card-block.component.html',
  styleUrls: ['./card-block.component.css']
})
export class CardBlockComponent implements OnInit {

  @Input()
    public offerObject: Offers;

  public warehouse: WareHouse | null ;
  public loading: boolean = true;

  constructor(
    private flexServices: FlexServices,
  ) {}

  async ngOnInit(): Promise<void> {
    await this.getService();
  }


  getService(): void {
    this.flexServices.getServiceAll()
      .subscribe(resp => {
        this.warehouse =  resp.find(item => item.serviceAreaId === this.offerObject.serviceAreaId) || null;
        this.loading = false;
      });
  }

}
