import { NgIf } from "@angular/common";
import { Component, Input } from "@angular/core";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

@Component({
  selector: "app-loading",
  standalone: true,
  imports: [MatProgressSpinnerModule, NgIf],
  templateUrl: "./loading.component.html",
  styleUrl: "./loading.component.scss",
})
export class LoadingComponent {
  @Input() isSubmit!: boolean;
}
