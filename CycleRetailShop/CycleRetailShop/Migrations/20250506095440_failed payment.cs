using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CycleRetailShop.Migrations
{
    /// <inheritdoc />
    public partial class failedpayment : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "PhoneNumber",
                table: "FailedPaymentAttempts",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PhoneNumber",
                table: "FailedPaymentAttempts");
        }
    }
}
