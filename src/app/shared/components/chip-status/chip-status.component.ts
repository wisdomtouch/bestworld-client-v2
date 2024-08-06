import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";

import { TicketStatus } from "@app/shared/enums/ticket.emum";
import { MaterialModule } from "@app/shared/modules/material.module";

@Component({
  selector: "app-chip-status",
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: "./chip-status.component.html",
})
export class ChipStatusComponent {
  @Input() isActive?: boolean;
  @Input() massage?: string;
  @Input() reqStatus?: string;
  @Input() backgroundColor?: string;
  @Input() textColor?: string;
  protected readonly TicketStatus = TicketStatus;
}
