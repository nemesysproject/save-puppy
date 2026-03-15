import { Component, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink, RouterLinkActive } from "@angular/router";

interface NavItem {
	label: string;
	path: string;
	icon: string;
	children?: NavItem[];
}

@Component({
	selector: "app-sidebar",
	standalone: true,
	imports: [CommonModule, RouterLink, RouterLinkActive],
	templateUrl: "./sidebar.component.html",
	styleUrl: "./sidebar.component.scss",
})
export class SidebarComponent {
	isCollapsed = signal(false);
	expandedItems = signal<string[]>([]);

	navItems: NavItem[] = [
		{
			label: "Dashboard",
			path: "/dashboard",
			icon: "📊",
		},
		{
			label: "Refugios",
			path: "/shelters",
			icon: "🏠",
		},
		{
			label: "Mascotas",
			path: "/pets",
			icon: "🐕",
		},
		{
			label: "Adopciones",
			path: "/adoptions",
			icon: "❤️",
		},
		{
			label: "Usuarios",
			path: "/users",
			icon: "👥",
		},
		{
			label: "Reportes",
			path: "/reports",
			icon: "📈",
			children: [
				{ label: "Mascotas", path: "/reports/pets", icon: "🐕" },
				{ label: "Adopciones", path: "/reports/adoptions", icon: "❤️" },
			],
		},
		{
			label: "Configuración",
			path: "/settings",
			icon: "⚙️",
		},
	];

	toggleSidebar(): void {
		this.isCollapsed.update((val) => !val);
	}

	toggleSubmenu(label: string): void {
		this.expandedItems.update((items) => {
			const index = items.indexOf(label);
			if (index > -1) {
				return items.filter((_, i) => i !== index);
			} else {
				return [...items, label];
			}
		});
	}

	isMenuOpen(label: string): boolean {
		return this.expandedItems().includes(label);
	}
}
