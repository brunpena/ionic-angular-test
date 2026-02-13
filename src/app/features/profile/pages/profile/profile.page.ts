import { Component, OnInit } from '@angular/core';
import { IonicModule, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsersService } from 'src/app/core/services/users.service';

interface User {
  id: string;
  name: string;
  email: string;
  city?: string;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  imports: [IonicModule, CommonModule, FormsModule],
})
export class ProfilePage implements OnInit {

  user?: User;
  loading = true;
  saving = false;

  constructor(
    private usersSvc: UsersService,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.loadMe();
  }

  loadMe() {
    this.loading = true;
    this.usersSvc.me().subscribe({
      next: (user) => {
        this.user = user as User;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  async save() {
    if (!this.user) return;

    this.saving = true;

    this.usersSvc.updateMe({
      name: this.user.name,
      city: this.user.city,
    }).subscribe({
      next: async () => {
        this.saving = false;
        const toast = await this.toastCtrl.create({
          message: 'Perfil atualizado com sucesso',
          duration: 2000,
          color: 'success',
          position: 'top'
        });
        toast.present();
      },
      error: async () => {
        this.saving = false;
        const toast = await this.toastCtrl.create({
          message: 'Erro ao salvar perfil',
          duration: 2000,
          color: 'danger',
          position: 'top'
        });
        toast.present();
      }
    });
  }
}
