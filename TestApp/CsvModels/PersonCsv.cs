using CsvHelper.Configuration.Attributes;

namespace TestApp.CsvModels
{
    public class PersonCsv
    {
        [Optional]
        public int Id{ get; set; }
        public string Name { get; set; }
        public string DateOfBirth { get; set; }
        public bool IsMarried { get; set; }
        public string Phone { get; set; }
        public string Salary { get; set; }
    }
}