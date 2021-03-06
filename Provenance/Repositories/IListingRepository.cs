using System.Collections.Generic;
using Provenance.Models;

namespace Provenance.Repositories
{
    public interface IListingRepository
    {
        List<Listing> GetAllListings();
        Listing GetListingById(int id);
        List<Listing> GetListingByUserProfileId(int userProfileId);
        void AddListing(Listing listing);
        void UpdateListing(Listing listing);
        void DeleteListing(int id);
        public List<Listing> GetAllUserListings(string FirebaseUserId);
        public List<Listing> Search(string criterion, bool sortDescending);
    }
}