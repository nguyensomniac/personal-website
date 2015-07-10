###
# Compass
###

# Change Compass configuration
# compass_config do |config|
#   config.output_style = :compact
# end

###
# Page options, layouts, aliases and proxies
###

# Per-page layout changes:
#
# With no layout
# page "/path/to/file.html", :layout => false
#
# With alternative layout
# page "/path/to/file.html", :layout => :otherlayout
#
# A path which all have the same layout
# with_layout :admin do
#   page "/admin/*"
# end

# Proxy pages (http://middlemanapp.com/basics/dynamic-pages/)
# proxy "/this-page-has-no-template.html", "/template-file.html", :locals => {
#  :which_fake_page => "Rendering a fake page with a local variable" }
data.work.projects.each do |project|
  project_url = project.title.gsub(/\s/, '-').downcase
  proxy "/projects/#{project_url}.html", "/work.html", :locals => {:project => project}
end

#ignore pages
ignore "/work/*"
###
# Helpers
###

# Automatic image dimensions on image_tag helper
# activate :automatic_image_sizes

# Reload the browser automatically whenever files change
# configure :development do
#   activate :livereload
# end

# Methods defined in the helpers block are available in templates
helpers do
  def markdown(src)
    output = Tilt['markdown'].new(src).render
  end
  def make_url(title)
    title.gsub(/\s/, '-').downcase
  end
end

set :css_dir, 'css'

set :js_dir, 'js'

set :images_dir, 'img'

activate :directory_indexes
# Build-specific configuration
configure :build do
  # For example, change the Compass output style for deployment
  # activate :minify_css

  # Minify Javascript on build
  # activate :minify_javascript

  # Enable cache buster
  # activate :asset_hash

  # Use relative URLs
  # activate :relative_assets

  # Or use a different image path
  # set :http_prefix, "/Content/images/"
end

#sprockets
#enable bower
sprockets.append_path File.join root, 'bower_components'
sprockets.import_asset 'jquery/dist/jquery.js'
sprockets.import_asset 'd3/d3.js'