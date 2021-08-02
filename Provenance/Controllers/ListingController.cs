using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Security.Claims;
using Provenance.Models;
using Provenance.Repositories;

namespace Provenance.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ListingsController : ControllerBase
    {
        private readonly IListingRepository _listingRepository;
        private readonly IUserProfileRepository _userProfileRepository;

        public ListingsController(IListingRepository listingRepository, IUserProfileRepository userProfileRepository)
        {
            _listingRepository = listingRepository;
            _userProfileRepository = userProfileRepository;
        }


        [HttpGet]
        public IActionResult Get()
        {
            return Ok(_listingRepository.GetAllListings());
        }

        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            var post = _listingRepository.GetListingById(id);
            if (post == null)
            {
                return NotFound();
            }
            return Ok(post);
        }

        [HttpGet("comment/{id}")]
        public IActionResult GetWithComments(int id)
        {
            var post = _listingRepository.GetListingByIdWithComments(id);
            if (post == null)
            {
                return NotFound();
            }
            return Ok(post);
        }

        [HttpGet("userProfileId/{userProfileId}")]
        public IActionResult GetListingByUserProfileId(int userProfileId)
        {
            var posts = _listingRepository.GetListingByUserProfileId(userProfileId);
            if (posts == null)
            {
                return NotFound();
            }
            return Ok(posts);
        }

        [HttpPost]
        public IActionResult AddListing(Listing listing)
        {
            var currentUser = GetCurrentUserProfile2();
            listing.UserProfileId = currentUser.Id;
            DateTime dateCreated = DateTime.Now;

            listing.CreateDateTime = dateCreated;
            listing.IsApproved = true;

            _listingRepository.AddListing(listing);
            return CreatedAtAction("Get", new { id = listing.Id }, listing);
        }

        [HttpPut("{id}")]
        public IActionResult Put(int id, Listing listing)
        {
            var currentUser = GetCurrentUserProfile2();
            if (listing.UserProfileId != currentUser.Id)
            {
                return Unauthorized();
            }
            if (id != listing.Id)
            {
                return BadRequest();
            }

            _listingRepository.UpdateListing(listing);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            _listingRepository.DeleteListing(id);
            return NoContent();
        }
        [HttpGet("GetAllUserListings")]
        public IActionResult GetAllUserListings()
        {
            var user = GetCurrentUserProfile();
            if (user == null)
            {
                return Unauthorized();
            }
            else
            {
                var posts = _listingRepository.GetAllUserListings(user);
                return Ok(posts);
            }
        }
        private UserProfile GetCurrentUserProfile2()
        {
            var firebaseUserId = User.FindFirst(ClaimTypes.NameIdentifier).Value;
            return _userProfileRepository.GetByFirebaseUserId(firebaseUserId);
        }

        private string GetCurrentUserProfile()
        {
            var firebaseUserId = User.FindFirst(ClaimTypes.NameIdentifier).Value;

            if (firebaseUserId != null)
            {

                return firebaseUserId;
            }
            else
            {
                return null;
            }
        }
    }
}

