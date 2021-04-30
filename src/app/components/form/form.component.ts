import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {CommonService} from '../../services/common/common.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  form: FormGroup;
  action: string;
  target: string;
  item: any;
  clients: any;
  users: any;
  products: any;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<FormComponent>,
    private commonService: CommonService,
    @Inject(MAT_DIALOG_DATA) data) {
    this.item = data.item;
    this.target = data.target;
    this.action = data.action;
  }

  ngOnInit() {
    switch (this.target) {
      case 'client': {
        this.form = this.fb.group({
          id: [this.item.id, []],
          name: [this.item.name, [Validators.required]],
          description: [this.item.description, [Validators.required]]
        });
        break;
      }
      case 'employee': {
        this.form = this.fb.group({
          id: [this.item.id, []],
          name: [this.item.name, [Validators.required]],
          age: [this.item.age, [Validators.required]],
          password: [this.item.password, [Validators.required]]
        });
        break;
      }
      case 'product': {
        this.form = this.fb.group({
          id: [this.item.id, []],
          name: [this.item.name, [Validators.required]],
          stock: [this.item.stock, [Validators.required]],
          price: [this.item.price, [Validators.required]]
        });
        break;
      }
      case 'commande': {
        this.getData();
        if (this.action === 'add') {
          this.form = this.fb.group({
            id: [this.item.id, []],
            client_name: [this.item.clients],
            product_name: [this.item.products],
            employee_name: [this.item.users],
            quantity: [this.item.quantity, [Validators.required]]
          });
        } else {
          this.form = this.fb.group({
            id: [this.item.id, []],
            client_name: [this.item.client.name],
            product_name: [this.item.product.name],
            employee_name: [this.item.employee.name],
            quantity: [this.item.quantity, [Validators.required]]
          });
        }
        break;
      }
    }
  }
  getData() {
    this.commonService.get('client').subscribe(res => {
      this.clients = res.data;
    });
    this.commonService.get('employee').subscribe(res => {
      this.users = res.data;
    });
    this.commonService.get('product').subscribe(res => {
      this.products = res.data;
    });
  }
  save() {
    if (this.action === 'add') {
      this.commonService.add(this.target, this.form.value).subscribe(res => {
        this.dialogRef.close();
      });
    } else {
      this.commonService.update(this.target, this.form.value).subscribe(res => {
        this.dialogRef.close();
      });
    }
  }
  close() {
    this.dialogRef.close();
  }
}
