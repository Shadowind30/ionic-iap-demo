import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { InAppPurchase2 } from '@awesome-cordova-plugins/in-app-purchase-2/ngx';
import { AlertController, Platform } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  public patience = 0;
  private readonly PRODUCT_ID = 'com.iapdemo.patience';

  constructor(
    public platform: Platform,
    private store: InAppPurchase2,
    private alertCtrl: AlertController,
    private ref: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.refreshStore();
  }

  public buyPatience() {
    this.store.order(this.PRODUCT_ID);
    this.store
      .when(this.PRODUCT_ID)
      .approved(async (p) => {
        p.verify();
        console.log('approved');
        this.patience += 1;
        this.ref.detectChanges();
        const alert = await this.alertCtrl.create({
          header: 'Compra completada',
          message: 'Quieres comprar mas? Nunca se tiene suficiente.',
          buttons: ['Listo'],
        });
        await alert.present();
      })
      .verified((p) => {
        p.finish();
        console.log('purchase verified');
      });
  }

  private refreshStore() {
    this.platform.ready().then(() => {
      this.store.verbosity = this.store.DEBUG;
      this.store.register({
        id: this.PRODUCT_ID,
        type: this.store.CONSUMABLE,
      });
      this.store.refresh();
      console.log('store refreshed');
    });
  }
}
