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

        public List<Listing> Search(string criterion, bool sortDescending)
        {
            using (var conn = Connection)
            {
                conn.Open();
                using (var cmd = conn.CreateCommand())
                {
                    var sql = @"
                        SELECT l.Id, l.Title, l.Content, l.ImageLocation, l.CreateDateTime, l.PublishDateTime,
                                l.IsApproved, l.UserProfileId, l.isDeleted, l.Price,
                                up.DisplayName
                        FROM Listings l
                        LEFT JOIN UserProfile up on up.Id = l.UserProfileId
                        WHERE l.IsApproved = 1 AND l.IsDeleted = 0 AND l.Title like @criterion";

                    if (sortDescending)
                    {
                        sql += " ORDER BY l.PublishDateTime DESC";
                    }
                    else
                    {
                        sql += " ORDER BY l.PublishDateTime";
                    }

                    cmd.CommandText = sql;
                    DbUtils.AddParameter(cmd, "@Criterion", $"%{criterion}%");
                    var reader = cmd.ExecuteReader();

                    var listings = new List<Listing>();
                    while (reader.Read())
                    {
                        listings.Add(new Listing()
                        {
                            Id = DbUtils.GetInt(reader, "Id"),
                            Title = DbUtils.GetString(reader, "Title"),
                            Content = DbUtils.GetString(reader, "Content"),
                            CreateDateTime = DbUtils.GetDateTime(reader, "CreateDateTime"),
                            PublishDateTime = DbUtils.GetDateTime(reader, "PublishDateTime"),
                            ImageLocation = DbUtils.GetString(reader, "ImageLocation"),
                            IsApproved = DbUtils.GetBoolean(reader, "IsApproved"),
                            isDeleted = DbUtils.GetBoolean(reader, "isDeleted"),
                            UserProfileId = DbUtils.GetInt(reader, "UserProfileId"),
                            UserProfile = new UserProfile()
                            {
                                Id = DbUtils.GetInt(reader, "UserProfileId"),
                                DisplayName = DbUtils.GetString(reader, "DisplayName"),
                            },
                        });
                    }
                    reader.Close();

                    return listings;
                }
            }
        }

        public List<Listing> GetAllListings()
        {
            using (var conn = Connection)
            {
                conn.Open();
                using (var cmd = conn.CreateCommand())
                {
                    cmd.CommandText = @"
                        SELECT l.Id, l.Title, l.Content, l.ImageLocation, l.CreateDateTime, l.PublishDateTime,
                                l.IsApproved, l.UserProfileId, l.Price,
                                up.DisplayName
                        FROM Listings l
                        LEFT JOIN UserProfile up on up.Id = l.UserProfileId
                        WHERE l.IsApproved = 1 AND l.IsDeleted = 0
                        ORDER BY l.CreateDateTime DESC";

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

        public Listing GetListingById(int id)
        {
            using (var conn = Connection)
            {
                conn.Open();
                using (var cmd = conn.CreateCommand())
                {
                    cmd.CommandText = @"
                    SELECT l.Id, l.Title, l.Content, l.ImageLocation, l.CreateDateTime, l.PublishDateTime,
                           l.IsApproved, l.UserProfileId, l.Price,
                    up.DisplayName
                    FROM Listings l
                    LEFT JOIN UserProfile up on up.Id = l.UserProfileId
                    WHERE l.Id = @Id AND l.isDeleted = 0 AND l.IsDeleted = 0";

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
                           l.IsApproved, l.UserProfileId,  l.Price,
                           up.DisplayName       
                    FROM Listings l
                    LEFT JOIN UserProfile up on up.Id = l.UserProfileId
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
                        INSERT INTO Listings (Title, Content, ImageLocation, CreateDateTime, PublishDateTime, IsApproved, UserProfileId, isDeleted, l.Price)
                        OUTPUT INSERTED.ID
                        VALUES (@Title, @Content, @ImageLocation, @CreateDateTime, @PublishDateTime, @IsApproved, @UserProfileId, @isDeleted, @Price)";

                    DbUtils.AddParameter(cmd, "@Title", listing.Title);
                    DbUtils.AddParameter(cmd, "@Content", listing.Content);
                    DbUtils.AddParameter(cmd, "@ImageLocation", listing.ImageLocation);
                    DbUtils.AddParameter(cmd, "@CreateDateTime", listing.CreateDateTime);
                    DbUtils.AddParameter(cmd, "@PublishDateTime", listing.PublishDateTime);
                    DbUtils.AddParameter(cmd, "@Price", listing.Price);
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
                        UPDATE Listings 
                           SET Title = @Title,
                               Content = @Content,
                               ImageLocation = @ImageLocation,
                               PublishDateTime = @PublishDateTime,
                               UserProfileId = @UserProfileId,
                               Price = @Price
                         WHERE Id = @Id";

                    DbUtils.AddParameter(cmd, "@Title", listing.Title);
                    DbUtils.AddParameter(cmd, "@Content", listing.Content);
                    DbUtils.AddParameter(cmd, "@ImageLocation", listing.ImageLocation);
                    DbUtils.AddParameter(cmd, "@PublishDateTime", listing.PublishDateTime);
                    DbUtils.AddParameter(cmd, "@Price", listing.Price);
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
                    cmd.CommandText = @"UPDATE Listings SET isDeleted=@isDeleted WHERE Id=@Id";
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
                              l.UserProfileId,  l.Price,
                              u.FirstName, u.LastName, u.DisplayName, 
                              u.Email, u.CreateDateTime, u.ImageLocation AS AvatarImage,
                              u.UserTypeId, 
                              ut.[Name] AS UserTypeName
                         FROM Listings l
                              LEFT JOIN UserProfile u ON l.UserProfileId = u.id
                              LEFT JOIN UserType ut ON u.UserTypeId = ut.id
                        WHERE PublishDateTime < SYSDATETIME() AND u.FirebaseUserId = @FirebaseUserId AND l.isDeleted = 0
                        ORDER BY PublishDateTime DESC";
                    DbUtils.AddParameter(cmd, "@FirebaseUserId", FirebaseUserId);
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
                Price = DbUtils.GetInt(reader, "Price"),
                UserProfileId = DbUtils.GetInt(reader, "UserProfileId"),
                UserProfile = new UserProfile()
                {
                    DisplayName = DbUtils.GetString(reader, "DisplayName")
                },
            };
        }


    }
}