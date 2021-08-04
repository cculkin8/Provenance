using System;
using System.Collections.Generic;

namespace Provenance.Models
{
    public class Listing
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public string ImageLocation { get; set; }
        public DateTime CreateDateTime { get; set; }
        public DateTime? PublishDateTime { get; set; }
        public bool IsApproved { get; set; }
        public int UserProfileId { get; set; }
        public UserProfile UserProfile { get; set; }
        public bool isDeleted { get; set; }
        public int Price { get; set; }
        public string Contact { get; set; }
    }
}