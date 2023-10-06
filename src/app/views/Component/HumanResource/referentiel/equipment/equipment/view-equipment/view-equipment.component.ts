import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Affectation, AmortizationType, Equipment, PurchaseMethod, StatusDisponibility } from 'app/shared/models/equipment';
import { EquipmentService } from '../../equipment.service';
import { ActivatedRoute } from '@angular/router';
import { Employee } from 'app/shared/models/Employee';

@Component({
  selector: 'app-view-equipment',
  templateUrl: './view-equipment.component.html',
  styleUrls: ['./view-equipment.component.scss']
})
export class ViewEquipmentComponent implements OnInit {
  public equipment : Equipment;
  public employee : Employee;
  public id : number;

  constructor(
    private equipmentService :EquipmentService,
    private dialogRef: MatDialogRef<ViewEquipmentComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private route : ActivatedRoute) { }

  ngOnInit(): void {
    const data = this.data;
  this.equipment= data.equipment;
  this.employee = data.employee;
 // this.getEquipment();
      }
      getTranslation(value: boolean): string {
        return value ? 'Oui' : 'Non';
      }
 
  /*getEquipment(){
    this.equipmentService.getEquipment(this.id).subscribe((data: any) => {
      this.equipment = data;
      console.log(data)
    });
  }*/
  closeDialog(): void {
    // Fermer la boîte de dialogue
    this.dialogRef.close();
  }

  StatusDisponibilityMap = {
    [StatusDisponibility.AVAILABLE]: 'Disponible',
    [StatusDisponibility.UNAVAILABLE]: 'Indisponible'
    
  };
 AffectationMap={
  [Affectation.AFFECTED]:'Affecté',
  [Affectation.UNAFFECTED]:'Non Affecté'
 }
 
 PurchaseMethodMap= {
  [PurchaseMethod.PURCHASE]: 'Achat',
  [PurchaseMethod.RENT]: 'Location'
};

AmortizationTypeMap= {
  [AmortizationType.LINEAR]: 'Linéaire',
  [AmortizationType.ANTICIPATORY]: 'Anticipatif',
  [AmortizationType.CONSTANT]: 'Constant',
  [AmortizationType.DECLINING_BALANCE]: 'Dégressif',
  [AmortizationType.PROGRESSIVE]: 'Progressif',
  [AmortizationType.PROPORTIONAL]: 'Proportionnel'
  
};
}
