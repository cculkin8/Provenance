using System;
using System.Collections.Generic;
using Microsoft.Extensions.Configuration;
using Provenance.Models;


namespace Provenance.Repositories
{
    public class TagRepository : BaseRepository, ITagRepository
    {
        public TagRepository(IConfiguration configuration) : base(configuration) { }

        public List<Tag> GetAll()
        {
            using (var conn = Connection)
            {
                conn.Open();
                using (var cmd = conn.CreateCommand())
                {
                    cmd.CommandText = "SELECT id, name FROM Tag where IsDeleted = 0";
                    var reader = cmd.ExecuteReader();

                    var tags = new List<Tag>();

                    while (reader.Read())
                    {
                        tags.Add(new Tag()
                        {
                            Id = reader.GetInt32(reader.GetOrdinal("Id")),
                            Name = reader.GetString(reader.GetOrdinal("name")),
                        });
                    }

                    reader.Close();

                    return tags;
                }
            }
        }

        public List<Tag> GetAllByListing(int listingId)
        {
            using (var conn = Connection)
            {
                conn.Open();
                using (var cmd = conn.CreateCommand())
                {
                    cmd.CommandText = @"SELECT DISTINCT t.id, t.name FROM Tag t 
                                        Join ListingTag pt on t.id = pt.TagId 
                                        Where pt.ListingId = @listingId And t.IsDeleted = 0";
                    cmd.Parameters.AddWithValue("@listingId", listingId);
                    var reader = cmd.ExecuteReader();

                    var tags = new List<Tag>();

                    while (reader.Read())
                    {
                        tags.Add(new Tag()
                        {
                            Id = reader.GetInt32(reader.GetOrdinal("Id")),
                            Name = reader.GetString(reader.GetOrdinal("name")),
                        });
                    }

                    reader.Close();

                    return tags;
                }
            }
        }

        public void DeleteListingTag(int id, int listingId)
        {
            using (var conn = Connection)
            {
                conn.Open();
                using (var cmd = conn.CreateCommand())
                {
                    cmd.CommandText = @"Delete From ListingTag 
                                        where TagId = @id And ListingId = @listingId";
                    cmd.Parameters.AddWithValue("@id", id);
                    cmd.Parameters.AddWithValue("@listingId", listingId);
                    cmd.ExecuteNonQuery();
                }
                conn.Close();
            }
        }

        public void AddListingTag(int id, int listingId)
        {
            using (var conn = Connection)
            {
                conn.Open();
                using (var cmd = conn.CreateCommand())
                {
                    cmd.CommandText = "Select count(Id) From ListingTag Where TagId=@id And ListingId=@listingId";
                    cmd.Parameters.AddWithValue("@id", id);
                    cmd.Parameters.AddWithValue("@listingId", listingId);
                    var tags = cmd.ExecuteScalar();
                    if (Convert.ToInt32(tags) == 0)
                    {
                        cmd.CommandText = @"Insert Into ListingTag(TagId, ListingId) 
                                        Values(@id, @listingId)";
                        cmd.ExecuteNonQuery();
                    }

                }
                conn.Close();
            }
        }


        public void Delete(int id)
        {
            using (var conn = Connection)
            {
                conn.Open();
                using (var cmd = conn.CreateCommand())
                {
                    cmd.CommandText = "Update Tag set IsDeleted = 1 where Id = @id";
                    cmd.Parameters.AddWithValue("@id", id);
                    cmd.ExecuteNonQuery();
                }
                conn.Close();
            }
        }

        public void Edit(Tag toEdit)
        {
            using (var conn = Connection)
            {
                conn.Open();
                using (var cmd = conn.CreateCommand())
                {
                    cmd.CommandText = "Update Tag set Name = @name where Id = @id";
                    cmd.Parameters.AddWithValue("@name", toEdit.Name);
                    cmd.Parameters.AddWithValue("@id", toEdit.Id);
                    cmd.ExecuteNonQuery();
                }
                conn.Close();
            }
        }


        public Tag GetTagById(int id)
        {
            using (var conn = Connection)
            {
                conn.Open();
                using (var cmd = conn.CreateCommand())
                {
                    cmd.CommandText = "SELECT id, name FROM Tag Where IsDeleted = 0 And Id = @id";
                    cmd.Parameters.AddWithValue("@id", id);
                    var reader = cmd.ExecuteReader();
                    while (reader.Read())
                    {
                        return new Tag()
                        {
                            Id = reader.GetInt32(reader.GetOrdinal("Id")),
                            Name = reader.GetString(reader.GetOrdinal("name")),
                        };
                    }

                    reader.Close();
                }
                return null;
            }
        }
        public int Add(Tag add)
        {
            using (var conn = Connection)
            {
                conn.Open();
                using (var cmd = conn.CreateCommand())
                {
                    cmd.CommandText = "Insert Into Tag(Name) OUTPUT INSERTED.ID Values(@name)";
                    cmd.Parameters.AddWithValue("@name", add.Name);
                    add.Id = (int)cmd.ExecuteScalar();
                }
                conn.Close();
                return add.Id;
            }
        }

        public List<Tag> GetTagsNotOnListing(int id)
        {
            using (var conn = Connection)
            {
                conn.Open();
                using (var cmd = conn.CreateCommand())
                {
                    cmd.CommandText = @"SELECT pt.listingId, t.name, t.id 
                                FROM Tag t
                                left join ListingTag pt on t.id = pt.TagId
                                where pt.ListingId != @id or pt.listingId is null ";
                    cmd.Parameters.AddWithValue("@id", id);
                    var reader = cmd.ExecuteReader();

                    var tags = new List<Tag>();

                    while (reader.Read())
                    {
                        if (reader.IsDBNull(reader.GetOrdinal("ListingId")))
                        {
                            tags.Add(new Tag()
                            {
                                Id = reader.GetInt32(reader.GetOrdinal("Id")),
                                Name = reader.GetString(reader.GetOrdinal("name")),
                            });
                        }
                    }

                    reader.Close();

                    return tags;
                }
            }
        }
    }
}
