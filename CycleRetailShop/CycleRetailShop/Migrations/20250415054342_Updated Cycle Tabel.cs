using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CycleRetailShop.Migrations
{
    /// <inheritdoc />
    public partial class UpdatedCycleTabel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "AddedDate",
                table: "Cycles",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedDate",
                table: "Cycles",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "WarrantyPeriod",
                table: "Cycles",
                type: "character varying(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "description",
                table: "Cycles",
                type: "character varying(255)",
                maxLength: 255,
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AddedDate",
                table: "Cycles");

            migrationBuilder.DropColumn(
                name: "UpdatedDate",
                table: "Cycles");

            migrationBuilder.DropColumn(
                name: "WarrantyPeriod",
                table: "Cycles");

            migrationBuilder.DropColumn(
                name: "description",
                table: "Cycles");
        }
    }
}
