using System.Collections.Generic;
using Microsoft.Extensions.Configuration;
using Provenance.Models;


namespace Provenance.Repositories
{
    public interface ITagRepository
    {
        List<Tag> GetAll();
        int Add(Tag add);
        void Delete(int id);
        Tag GetTagById(int id);
        void Edit(Tag toEdit);
        void AddListingTag(int id, int postId);
        void DeleteListingTag(int id, int postId);
        List<Tag> GetAllByListing(int postId);

        public List<Tag> GetTagsNotOnListing(int id);
    }
}

