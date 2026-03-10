import { useState, useEffect } from 'react';
import { saveProfileDetails, getProfilePosts, upsertProfilePost } from '@/lib/api.js';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';

const EMPTY_PROFILE = {
  fullName: '',
  role: '',
  location: '',
  avatar: '',
  bio: '',
  website: '',
  email: ''
};

export default function Profile({ currentUser }) {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState({ ...EMPTY_PROFILE, ...currentUser });
  const [formData, setFormData] = useState({ ...EMPTY_PROFILE, ...currentUser });
  const [posts, setPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [isPostsLoading, setIsPostsLoading] = useState(true);

  // Update profile if currentUser changes (e.g., re-login)
  useEffect(() => {
    if (currentUser) {
      const initialData = { ...EMPTY_PROFILE, ...currentUser };
      setProfile(initialData);
      setFormData(initialData);
    }
  }, [currentUser]);

  useEffect(() => {
    document.title = 'Profile · ArtXPlore';
  }, []);

  useEffect(() => {
    if (activeTab === 'profile' && currentUser) {
      const fetchPosts = async () => {
        try {
          setIsPostsLoading(true);
          const res = await getProfilePosts(currentUser.id || 'current-user');
          if (res.success) {
            setPosts(res.posts);
          }
        } catch (error) {
          console.error('Failed to fetch posts', error);
        } finally {
          setIsPostsLoading(false);
        }
      };
      fetchPosts();
    }
  }, [activeTab, currentUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await saveProfileDetails(formData);
      setProfile(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save profile', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    setIsPosting(true);
    try {
      const res = await upsertProfilePost({
        userId: currentUser.id || 'current-user',
        content: newPostContent,
        image: null // Placeholder for now
      });
      if (res.success) {
        setPosts([res.post, ...posts]);
        setNewPostContent('');
      }
    } catch (error) {
      console.error('Failed to create post', error);
    } finally {
      setIsPosting(false);
    }
  };

  // Security check if somehow accessed without user information. This is a redundant one, since App.jsx should prevent this already anyway.
  if (!currentUser) {
    return <div className="container text-center" style={{ padding: '4rem' }}>Please sign in to view this profile.</div>;
  }

  const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '??';
  };

  const renderPostSkeleton = (count = 3) => (
    <div className="flex flex-col gap-4">
      {Array.from({ length: count }).map((_, idx) => (
        <Card key={idx}>
          <div className="flex gap-4">
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--c-bg-surface-hover)', animation: 'pulse 1.5s ease-in-out infinite' }} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ width: '140px', height: '14px', background: 'var(--c-bg-surface-hover)', borderRadius: '4px', animation: 'pulse 1.5s ease-in-out infinite' }} />
              <div style={{ width: '100px', height: '10px', background: 'var(--c-bg-surface-hover)', borderRadius: '4px', animation: 'pulse 1.5s ease-in-out infinite' }} />
              <div style={{ width: '100%', height: '12px', background: 'var(--c-bg-surface-hover)', borderRadius: '4px', animation: 'pulse 1.5s ease-in-out infinite' }} />
              <div style={{ width: '85%', height: '12px', background: 'var(--c-bg-surface-hover)', borderRadius: '4px', animation: 'pulse 1.5s ease-in-out infinite' }} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="page fade-in">
      <style>{`
        @keyframes pulse {
          0% { opacity: 0.7; }
          50% { opacity: 1; }
          100% { opacity: 0.7; }
        }
      `}</style>
      {/* Profile Header */}
      <div style={{
        background: 'linear-gradient(135deg, var(--c-brand-secondary), #1e1b4b)',
        color: 'white',
        padding: '4rem 0 6rem 0',
        marginBottom: '-3rem'
      }}>
        <div className="container" style={{ maxWidth: '1400px', width: '100%', padding: '0 1.5rem' }}>
          <div className="flex items-center gap-6" style={{ flexWrap: 'wrap' }}>
            {profile.avatar ? (
              <img
                src={profile.avatar}
                alt={profile.fullName}
                style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  border: '4px solid rgba(255,255,255,0.1)',
                  objectFit: 'cover'
                }}
              />
            ) : (
              <div style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                border: '4px solid rgba(255,255,255,0.1)',
                background: 'var(--c-brand-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2.5rem',
                fontWeight: 'bold'
              }}>
                {getInitials(profile.fullName)}
              </div>
            )}

            <div>
              <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{profile.fullName || 'Unnamed User'}</h1>
              <p style={{ fontSize: '1.1rem', opacity: 0.9, margin: 0 }}>
                {profile.role || 'No role set'} • {profile.location || 'No location set'}
              </p>
            </div>
            <div style={{ marginLeft: 'auto' }}>
              {!isEditing && (
                <Button
                  variant="secondary"
                  onClick={() => {
                    setIsEditing(true);
                    setFormData(profile);
                  }}
                  style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', border: 'none' }}
                >
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '0 1.5rem 4rem', maxWidth: '1400px', width: '100%' }}>
        {/* Tabs */}
        <div className="flex gap-4" style={{ marginBottom: '2rem', borderBottom: '1px solid var(--c-border)' }}>
          {['profile', 'settings'].map(tab => (
            <button
              key={tab}
              onClick={() => !isEditing && setActiveTab(tab)}
              disabled={isEditing}
              style={{
                padding: '1rem 0.5rem',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === tab ? '2px solid var(--c-brand-primary)' : '2px solid transparent',
                color: activeTab === tab ? 'var(--c-brand-primary)' : 'var(--c-text-secondary)',
                fontWeight: 600,
                textTransform: 'capitalize',
                cursor: isEditing ? 'not-allowed' : 'pointer',
                opacity: isEditing ? 0.5 : 1
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="slide-up">
          {isEditing ? (
            <Card style={{ padding: '2.5rem', maxWidth: '1400px', width: '100%', margin: '0 auto' }}>
              <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.75rem' }}>Edit Profile</h2>
                <Button variant="ghost" onClick={() => setIsEditing(false)} disabled={isSaving}>Cancel</Button>
              </div>

              <form onSubmit={handleSave}>
                <div className="flex flex-col gap-4">
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.75rem' }}>
                    <Input label="Full Name" name="fullName" value={formData.fullName} onChange={handleInputChange} />
                    <Input label="Role" name="role" value={formData.role} onChange={handleInputChange} />
                  </div>

                  <Input label="Location" name="location" value={formData.location} onChange={handleInputChange} />

                  <div className="input-group">
                    <label className="input-label">Bio</label>
                    <textarea
                      className="input-field"
                      rows="5"
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      style={{ resize: 'vertical' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.75rem' }}>
                    <Input label="Website" name="website" value={formData.website} onChange={handleInputChange} />
                    <Input label="Email" name="email" value={formData.email} onChange={handleInputChange} disabled />
                  </div>

                  <div className="flex justify-end gap-2" style={{ marginTop: '1.75rem' }}>
                    <Button type="submit" isLoading={isSaving}>Save Changes</Button>
                  </div>
                </div>
              </form>
            </Card>
          ) : activeTab === 'profile' ? (
            <div className="profile-grid">
              {/* Left Column: Info */}
              <div className="profile-info flex flex-col gap-6">
                <Card>
                  <h3 style={{ fontSize: '0.8rem', marginBottom: '1rem', color: 'var(--c-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>About</h3>
                  <p style={{ fontSize: '1rem', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                    {profile.bio || <span className="text-muted">This user has not written a bio yet.</span>}
                  </p>

                  <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
                    {profile.website && (
                      <a href={profile.website} target="_blank" rel="noreferrer" className="btn btn-secondary" style={{ fontSize: '0.875rem' }}>
                        Visit Website
                      </a>
                    )}
                  </div>
                </Card>

                <Card>
                  <h3 style={{ fontSize: '0.8rem', marginBottom: '1rem', color: 'var(--c-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Details</h3>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    <li style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--c-border)' }}>
                      <span className="text-muted">Role</span>
                      <span className="font-medium">{profile.role || 'Not set'}</span>
                    </li>
                    <li style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--c-border)' }}>
                      <span className="text-muted">Location</span>
                      <span className="font-medium">{profile.location || 'Not set'}</span>
                    </li>
                    <li style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--c-border)' }}>
                      <span className="text-muted">Email</span>
                      <span className="font-medium">{profile.email}</span>
                    </li>
                    <li style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0' }}>
                      <span className="text-muted">Member Since</span>
                      <span className="font-medium">November 2025</span>
                    </li>
                  </ul>
                </Card>
              </div>

              {/* Right Column: Posts */}
              <div className="profile-posts">
                <Card style={{ marginBottom: '2rem' }}>
                  <form onSubmit={handleCreatePost}>
                    <div className="input-group">
                      <textarea
                        className="input-field"
                        rows="3"
                        placeholder="What are you working on?"
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
                        style={{ resize: 'vertical', border: 'none', background: 'transparent', padding: 0, fontSize: '1.1rem' }}
                      />
                    </div>
                    <div className="flex justify-end" style={{ marginTop: '1rem', borderTop: '1px solid var(--c-border)', paddingTop: '1rem' }}>
                      <Button type="submit" disabled={!newPostContent.trim()} isLoading={isPosting}>Post Update</Button>
                    </div>
                  </form>
                </Card>

                <div className="flex flex-col gap-4">
                  {isPostsLoading ? (
                    renderPostSkeleton()
                  ) : posts.length === 0 ? (
                    <div className="text-center text-muted" style={{ padding: '2rem' }}>No posts yet.</div>
                  ) : (
                    posts.map(post => (
                      <Card key={post.id}>
                        <div className="flex gap-4">
                          {profile.avatar ? (
                            <img src={profile.avatar} alt={profile.fullName} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                          ) : (
                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--c-brand-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
                              {getInitials(profile.fullName)}
                            </div>
                          )}
                          <div style={{ flex: 1 }}>
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 style={{ margin: 0, fontSize: '1rem' }}>{profile.fullName}</h4>
                                <span className="text-muted" style={{ fontSize: '0.8rem' }}>{post.createdAt}</span>
                              </div>
                            </div>
                            <p style={{ marginTop: '0.75rem', lineHeight: '1.5' }}>{post.content}</p>
                            {post.image && (
                              <img src={post.image} alt="Post attachment" style={{ width: '100%', marginTop: '1rem', borderRadius: 'var(--radius-md)' }} />
                            )}
                            <div className="flex gap-4 text-muted" style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
                              <span>{post.likes || 0} Likes</span>
                              <span>{post.comments || 0} Comments</span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </div>

              <style>{`
                  .profile-grid {
                      display: grid;
                      grid-template-columns: 1fr;
                      gap: 2rem;
                  }
                  @media (min-width: 768px) {
                      .profile-grid {
                          grid-template-columns: 350px 1fr;
                      }
                  }
               `}</style>
            </div>
          ) : (
            <Card>
              <div className="text-center" style={{ padding: '3rem 1rem' }}>
                <p className="text-muted">Account settings are currently managed by your organization admin.</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
