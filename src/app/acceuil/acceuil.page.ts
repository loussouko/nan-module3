import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { Item } from './../services/storage.service';
import { StorageService } from './../services/storage.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { IonList, Platform, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Crop } from '@ionic-native/crop/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';

@Component({
  selector: 'app-acceuil',
  templateUrl: './acceuil.page.html',
  styleUrls: ['./acceuil.page.scss'],
})
export class AcceuilPage implements OnInit {
 
  items: Item[] = [];
 
  newItem: Item = <Item>{};


@ViewChild('mylist')mylist: IonList;
 
constructor(private storageService: StorageService, private plt: Platform,
  private toastController: ToastController, private route: Router) {
  this.plt.ready().then(() => {
    this.loadItems();
  });
}
  
     // CREATE
    addItem() {
      this.newItem.modified = Date.now();
      this.newItem.id = Date.now();
      this.storageService.addItem(this.newItem).then(item => {
        this.newItem = <Item>{};
        this.showToast('Recette ajoute!');
        this.loadItems(); // Or add it to the array directly
      });
    }
   
    // READ
    loadItems() {
      this.storageService.getItems().then(items => {
        this.items = items;
      });
    }

    // UPDATE
    updateItem(item: Item) {
      const nom = prompt('entrer le nom de la recette');
      const ig = prompt('entrer les ingredients!!!');
      if (nom && ig !== '')
      {
        const i = [];
        i.push(ig);
        item.title = nom;
        item.value = i;
      }
      item.title = `UPDATED: ${item.title}`;
      item.modified = Date.now();
        this.storageService.updateItem(item).then(item => {
        this.showToast('Recette mis a jour!');
        this.mylist.closeSlidingItems(); // Fix or sliding is stuck afterwards
        this.loadItems(); // Or update it inside the array directly
      });
    }
   
    // DELETE
    deleteItem(item: Item) {
      this.storageService.deleteItem(item.id).then(item => {
        this.showToast('Recette supprime!');
        this.mylist.closeSlidingItems(); // Fix or sliding is stuck afterwards
        this.loadItems(); // Or splice it from the array directly
      });
    }

    // Helper
    async showToast(msg) {
      const toast = await this.toastController.create({
        message: msg,
        duration: 2000
      });
      toast.present();
    }
  



  ngOnInit() {
  }
}
