import { Routes } from "@angular/router";
import { LoginComponent } from "./pages/login/login.component";
import { AuthGuard } from "shared-logic";

export const routes: Routes = [
	{
		path: "",
		redirectTo: "dashboard",
		pathMatch: "full",
	},
	{
		path: "login",
		component: LoginComponent,
	},
	{
		path: "register",
		loadComponent: () =>
			import("./pages/register/register.component").then(
				(m) => m.RegisterComponent,
			),
	},
	{
		path: "dashboard",
		loadComponent: () =>
			import("./pages/dashboard/dashboard.component").then(
				(m) => m.DashboardComponent,
			),
		canActivate: [AuthGuard],
	},
	{
		path: "pets/create",
		loadComponent: () =>
			import("./pages/pets/create-pet/create-pet.component").then(
				(m) => m.CreatePetComponent,
			),
		canActivate: [AuthGuard],
	},
	{
		path: "pets/edit/:id",
		loadComponent: () =>
			import("./pages/pets/edit-pet/edit-pet.component").then(
				(m) => m.EditPetComponent,
			),
		canActivate: [AuthGuard],
	},
	{
		path: "pets",
		loadComponent: () =>
			import("./pages/pets/pets.component").then((m) => m.PetsComponent),
		canActivate: [AuthGuard],
	},
	{
		path: "shelters",
		loadComponent: () =>
			import("./pages/shelters/shelters.component").then(
				(m) => m.SheltersComponent,
			),
		canActivate: [AuthGuard],
	},
	{
		path: "profile",
		loadComponent: () =>
			import("./pages/profile/profile.component").then(
				(m) => m.ProfileComponent,
			),
		canActivate: [AuthGuard],
	},
];
