using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using Provenance.Models;
using Provenance.Repositories;
using System.Security.Claims;


namespace Provenance.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UserProfileController : ControllerBase
    {
        private readonly IUserProfileRepository _userProfileRepository;
        public UserProfileController(IUserProfileRepository userProfileRepository)
        {
            _userProfileRepository = userProfileRepository;
        }
        [HttpPost("GetUnique")]
        public IActionResult GetUnique(UserProfile user)
        {
            UserProfile retValue = _userProfileRepository.CheckUnique(user);
            return Ok(retValue);
        }
        [HttpGet("GetAll")]
        public IActionResult GetAllUsers()
        {
            return Ok(_userProfileRepository.GetAllUsers());
        }
        [HttpGet("GetUser/{id}")]
        public IActionResult GetUser(int id)

        {
            var user = _userProfileRepository.GetUserById(id);
            if (user == null)
            {
                return NotFound();
            }
            return Ok(user);
        }


        [HttpGet("{firebaseUserId}")]
        public IActionResult GetUserProfile(string firebaseUserId)
        {
            return Ok(_userProfileRepository.GetByFirebaseUserId(firebaseUserId));
        }

        [HttpGet("DoesUserExist/{firebaseUserId}")]
        public IActionResult DoesUserExist(string firebaseUserId)
        {
            var userProfile = _userProfileRepository.GetByFirebaseUserId(firebaseUserId);
            if (userProfile == null)
            {
                return NotFound();
            }
            return Ok();
        }
        [HttpDelete("activate/{id}")]
        public IActionResult Activate(int id)
        {
            _userProfileRepository.Activate(id);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            int msg = 200;
            if (!_userProfileRepository.Delete(id)) msg = 666;
            return StatusCode(msg);
        }
        [HttpPut("{id}")]
        public IActionResult Put(int id, UserProfile user)
        {
            if (id != user.Id)
            {
                return BadRequest();
            }

            _userProfileRepository.Edit(user);
            return Ok(user);
        }
        private UserProfile GetCurrentUserProfile2()
        {
            var firebaseUserId = User.FindFirst(ClaimTypes.NameIdentifier).Value;
            return _userProfileRepository.GetByFirebaseUserId(firebaseUserId);
        }

        [HttpGet("GetCurrentUser3")]
        public IActionResult GetCurrentUser3()
        {
            var user = GetCurrentUserProfile2();
            return Ok(user);
        }

        [HttpPost]
        public IActionResult Post(UserProfile userProfile)
        {
            userProfile.CreateDateTime = DateTime.Now;
            userProfile.UserTypeId = UserType.AUTHOR_ID;
            _userProfileRepository.Add(userProfile);
            return CreatedAtAction(
                nameof(GetUserProfile),
                new { firebaseUserId = userProfile.FirebaseUserId },
                userProfile);
        }
    }
}
