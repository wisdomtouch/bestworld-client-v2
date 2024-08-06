import { Component, ViewEncapsulation } from "@angular/core";
import { MatCardModule } from "@angular/material/card";

import { ColumnTable } from "@app/shared/components/table/column-table";
import { TableComponent } from "@app/shared/components/table/table.component";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  standalone: true,
  imports: [MatCardModule, TableComponent],
  styleUrls: [],
  encapsulation: ViewEncapsulation.None,
})
export class DashboardComponent {
  tableColumns: Array<ColumnTable> = [
    {
      columnDef: "name",
      header: "Name",
      cell: (element: Record<string, string>) => `${element["name"]}`,
      isSort: true,
    },
    {
      columnDef: "networkId",
      header: "Network Id",
      cell: (element: Record<string, string>) => `${element["networkId"]}`,
      isSort: true,
    },
  ];

  dataColumns: Array<unknown> = [
    {
      name: "names",
      networkId: "Names",
    },
    {
      name: "namess",
      networkId: "Names",
    },
  ];
}
