import { Routes } from "@angular/router";
import { LoginComponent } from "./pages/login/login.component";
import { RegisterComponent } from "./pages/register/register.component";
import { LayoutComponent } from "./components/layout/layout.component";
import { DashboardComponent } from "./pages/dashboard/dashboard.component";
import { SheltersComponent } from "./pages/shelters/shelters.component";
import { CreateShelterComponent } from "./pages/shelters/create-shelter/create-shelter.component";
import { PetsComponent } from "./pages/pets/pets.component";
import { CreatePetComponent } from "./pages/pets/create-pet/create-pet.component";
import { UpdatePetComponent } from "./pages/pets/update-pet/update-pet.component";
import { AdoptionsComponent } from "./pages/adoptions/adoptions.component";
import { UsersComponent } from "./pages/users/users.component";
import { ReportsComponent } from "./pages/reports/reports.component";
import { authGuard } from "./guards/auth.guard";

export const routes: Routes = [
	{
		path: "",
		redirectTo: "login",
		pathMatch: "full",
	},
	{
		path: "login",
		component: LoginComponent,
	},
	{
		path: "register",
		component: RegisterComponent,
	},
	{
		path: "",
		component: LayoutComponent,
		canActivate: [authGuard],
		children: [
			{
				path: "dashboard",
				component: DashboardComponent,
			},
			{ path: "shelters", component: SheltersComponent },
			{ path: "shelters/create", component: CreateShelterComponent },
			{ path: "pets", component: PetsComponent },
			{ path: "pets/create", component: CreatePetComponent },
			{ path: "pets/edit/:id", component: UpdatePetComponent },
			{ path: "adoptions", component: AdoptionsComponent },
			{ path: "users", component: UsersComponent },
			{ path: "reports", component: ReportsComponent },
			{
				path: "settings",
				loadComponent: () =>
					import("./pages/dashboard/dashboard.component").then(
						(m) => m.DashboardComponent,
					),
			},
			{
				path: "profile",
				loadComponent: () =>
					import("./pages/dashboard/dashboard.component").then(
						(m) => m.DashboardComponent,
					),
			},
		],
	},
];
