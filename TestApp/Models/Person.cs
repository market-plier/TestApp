﻿using System;
using System.ComponentModel.DataAnnotations;
using System.Globalization;
using CsvHelper.Configuration.Attributes;
using Microsoft.VisualBasic;
using TestApp.CsvModels;

namespace TestApp.Models
{
    public class Person
    {
        public int Id { get; set; }
        public string Name { get; set; }
        [DataType(DataType.Date)]
        public DateTime DateOfBirth { get; set; }
        public bool IsMarried { get; set; }
        public string Phone { get; set; }
        public decimal Salary { get; set; }
        
        public static Person ParseFromCsv(PersonCsv personCsv)
        {
       
            return new Person()
            {
                Id = personCsv.Id,
                Name = personCsv.Name,
                DateOfBirth = DateTime.ParseExact(personCsv.DateOfBirth, "yyyy-MM-dd",
                System.Globalization.CultureInfo.InvariantCulture),
                IsMarried = personCsv.IsMarried,
                Phone = personCsv.Phone,
                Salary = decimal.Parse(personCsv.Salary, CultureInfo.InvariantCulture)
        };
        }
    }
}