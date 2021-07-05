#!/usr/bin/ruby

def handle_args
  if ARGV.length != 1 then
    puts "Error: Please provide input zip filename as argument"
    exit 1
  end

  @input_zip = ARGV[0]
  #@dest = "input-#{@input_zip[0...-4]}"
  @dest = "input"
end

def unzip_files
  system("rm -rf #{@dest}")
  system("mkdir #{@dest}")
  system("unzip -qq \"#{@input_zip}\" -d #{@dest}")
end

def clean_up_files
  if File.exist?("#{@dest}/results") then
    system("mv #{@dest}/results/* #{@dest}")
    system("rm -d #{@dest}/results")
  end
end

def clean_output_folder
  system("rm -rf output")
  system("mkdir output")
end

def start_container
  pwd = Dir.pwd
  Dir.chdir ".."
  system("call dev.bat")
  Dir.chdir pwd
end

# ----------------------------------------------------------------

handle_args()
unzip_files()
clean_up_files()
clean_output_folder()
start_container()
