import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../../core/services/admin.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      nombreAdmin: ['', [Validators.required]],
      passAdmin: ['', [Validators.required]],
      recordar: [true]
    });
  }

  ngOnInit(): void { }

  onLogin() {
    if (this.loginForm.invalid) return;

    const { nombreAdmin, passAdmin, recordar } = this.loginForm.value;

    this.adminService.login(nombreAdmin, passAdmin).subscribe({
      next: (res: any) => {
        const admin = res.admin;
        const storage = recordar ? localStorage : sessionStorage;

        storage.setItem('adminActivo', JSON.stringify(admin)); // 👈 ahora guarda en el elegido
        this.router.navigate(['/dashboard']);
      },
      error: () => alert('Nombre o contraseña incorrectos')
    });
  }
}
