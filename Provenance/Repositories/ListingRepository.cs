using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System.Security.Claims;
using System.Collections.Generic;
using Provenance.Models;
using Provenance.Utils;

namespace Provenance.Repositories
{
    public class ListingRepository : BaseRepository, IListingRepository
    {
        public ListingRepository(IConfiguration configuration) : base(configuration) { }

        public List<Listing> GetAllListings()
        {
            using (var conn = Connection)
            {
                conn.Open();
                using (var cmd = conn.CreateCommand())
                {
                    cmd.CommandText = @"
                        SELECT l.Id, l.Title, l.Content, l.ImageLocation, l.CreateDateTime, l.PublishDateTime,
                                l.IsApproved, l.UserProfileId,
                                c.Name as CategoryName,
                                ul.DisplayName
                        FROM Listing l
                        LEFT JOIN Category c on c.Id = l.CategoryId
                        LEFT JOIN UserProfile up on ul.Id = l.UserProfileId
                        WHERE l.IsApproved = 1 AND l.IsDeleted = 0 AND l.PublishDateTime < SYSDATETIME() AND ul.isDeleted = 0
                        ORDER BY l.CreateDateTime DESC";

                    var reader = cmd.ExecuteReader();
                    var posts = new List<Listing>();
                    while (reader.Read())
                    {
                        posts.Add(NewListingFromDb(reader));
                    }

                    reader.Close();

                    return posts;
                }
            }
        }

        public Listing GetListingById(int id)
        {
            using (var conn = Connection)
            {
                conn.Open();
                using (var cmd = conn.CreateCommand())
                {
                    cmd.CommandText = @"
                    SELECT l.Id, l.Title, l.Content, l.ImageLocation, l.CreateDateTime, l.PublishDateTime,
                           l.IsApproved, l.UserProfileId,
                           usl.DisplayName AS CommentUserProfileDisplayName        
                    FROM Listing l
                    LEFT JOIN UserProfile up on ul.Id = l.UserProfileId
                    LEFT JOIN UserProfile usp on usl.Id = com.UserProfileId
                    WHERE l.Id = @Id AND l.isDeleted = 0";

                    DbUtils.AddParameter(cmd, "@Id", id);

                    var reader = cmd.ExecuteReader();

                    Listing listing = null;
                    while (reader.Read())
                    {
                        if (listing == null)
                        {
                            listing = NewListingFromDb(reader);
                        }
  
                    }

                    reader.Close();

                    return listing;
                }

            }
        }

      
        public List<Listing> GetListingByUserProfileId(int userProfileId)
        {
            using (var conn = Connection)
            {
                conn.Open();
                using (var cmd = conn.CreateCommand())
                {
                    cmd.CommandText = @"
                    SELECT l.Id, l.Title, l.Content, l.ImageLocation, l.CreateDateTime, l.PublishDateTime,
                           l.IsApproved, l.CategoryId, l.UserProfileId,
                           ul.DisplayName       
                    FROM Listing l
                    LEFT JOIN UserProfile up on ul.Id = l.UserProfileId
                    WHERE l.UserProfileId = @Id AND l.isDeleted = 0
                    ORDER BY l.CreateDateTime DESC";

                    DbUtils.AddParameter(cmd, "@Id", userProfileId);

                    var reader = cmd.ExecuteReader();

                    var listings = new List<Listing>();
                    while (reader.Read())
                    {
                        listings.Add(NewListingFromDb(reader));
                    }

                    reader.Close();

                    return listings;
                }
            }
        }

        public void AddListing(Listing listing)
        {
            using (var conn = Connection)
            {
                conn.Open();
                using (var cmd = conn.CreateCommand())
                {
                    cmd.CommandText = @"
                        INSERT INTO Listing (Title, Content, ImageLocation, CreateDateTime, PublishDateTime, IsApproved, UserProfileId, isDeleted)
                        OUTPUT INSERTED.ID
                        VALUES (@Title, @Content, @ImageLocation, @CreateDateTime, @PublishDateTime, @IsApproved, @UserProfileId, @isDeleted)";

                    DbUtils.AddParameter(cmd, "@Title", listing.Title);
                    DbUtils.AddParameter(cmd, "@Content", listing.Content);
                    DbUtils.AddParameter(cmd, "@ImageLocation", listing.ImageLocation);
                    DbUtils.AddParameter(cmd, "@CreateDateTime", listing.CreateDateTime);
                    DbUtils.AddParameter(cmd, "@PublishDateTime", listing.PublishDateTime);
                    DbUtils.AddParameter(cmd, "@IsApproved", listing.IsApproved);
                    DbUtils.AddParameter(cmd, "@UserProfileId", listing.UserProfileId);
                    DbUtils.AddParameter(cmd, "@isDeleted", listing.isDeleted);
                    listing.Id = (int)cmd.ExecuteScalar();
                }
            }
        }

        public void UpdateListing(Listing listing)
        {
            using (var conn = Connection)
            {
                conn.Open();
                using (var cmd = conn.CreateCommand())
                {
                    cmd.CommandText = @"
                        UPDATE Listing 
                           SET Title = @Title,
                               Content = @Content,
                               ImageLocation = @ImageLocation,
                               PublishDateTime = @PublishDateTime,
                               UserProfileId = @UserProfileId
                         WHERE Id = @Id";

                    DbUtils.AddParameter(cmd, "@Title", listing.Title);
                    DbUtils.AddParameter(cmd, "@Content", listing.Content);
                    DbUtils.AddParameter(cmd, "@ImageLocation", listing.ImageLocation);
                    DbUtils.AddParameter(cmd, "@PublishDateTime", listing.PublishDateTime);
                    DbUtils.AddParameter(cmd, "@UserProfileId", listing.UserProfileId);
                    DbUtils.AddParameter(cmd, "@Id", listing.Id);

                    cmd.ExecuteNonQuery();
                }
            }
        }
        public void DeleteListing(int listingId)
        {
            using (SqlConnection conn = Connection)
            {
                conn.Open();
                using (SqlCommand cmd = conn.CreateCommand())
                {
                    cmd.CommandText = @"UPDATE Listing SET isDeleted=@isDeleted WHERE Id=@Id";
                    cmd.Parameters.AddWithValue("@isDeleted", 1);
                    cmd.Parameters.AddWithValue("@Id", listingId);

                    cmd.ExecuteNonQuery();
                }
            }
        }


        public List<Listing> GetAllUserListings(string FirebaseUserId)
        {
            using (var conn = Connection)
            {
                conn.Open();
                using (var cmd = conn.CreateCommand())
                {
                    cmd.CommandText = @"
                       SELECT l.Id, l.Title, l.Content, 
                              l.ImageLocation,
                              l.CreateDateTime, l.PublishDateTime, l.IsApproved, 
                              l.CategoryId, l.UserProfileId,
                              c.[Name] AS CategoryName,
                              u.FirstName, u.LastName, u.DisplayName, 
                              u.Email, u.CreateDateTime, u.ImageLocation AS AvatarImage,
                              u.UserTypeId, 
                              ut.[Name] AS UserTypeName
                         FROM Listing l
                              LEFT JOIN UserProfile u ON l.UserProfileId = u.id
                              LEFT JOIN UserType ut ON u.UserTypeId = ut.id
                        WHERE PublishDateTime < SYSDATETIME() AND u.FirebaseUserId = @FirebaseUserId AND l.isDeleted = 0
                        ORDER BY PublishDateTime DESC";
                    DbUtils.AddParameter(cmd, "@FirebaseUserId", FirebaseUserId);
                    var reader = cmd.ExecuteReader();

                    var posts = new List<Listing>();

                    while (reader.Read())
                    {
                        posts.Add(NewListingFromDb(reader));
                    }

                    reader.Close();

                    return posts;
                }
            }
        }

        private Listing NewListingFromDb(SqlDataReader reader)
        {
            return new Listing()
            {
                Id = DbUtils.GetInt(reader, "Id"),
                Title = DbUtils.GetString(reader, "Title"),
                Content = DbUtils.GetString(reader, "Content"),
                ImageLocation = DbUtils.GetString(reader, "ImageLocation"),
                CreateDateTime = DbUtils.GetDateTime(reader, "CreateDateTime"),
                PublishDateTime = DbUtils.GetNullableDateTime(reader, "PublishDateTime"),
                IsApproved = reader.GetBoolean(reader.GetOrdinal("IsApproved")),
                UserProfileId = DbUtils.GetInt(reader, "UserProfileId"),
                UserProfile = new UserProfile()
                {
                    DisplayName = DbUtils.GetString(reader, "DisplayName")
                },
            };
        }


    }
}