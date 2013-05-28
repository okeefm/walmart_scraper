#!/home/okeefm/.rvm/rubies/ruby-1.9.3-p392/bin/ruby

require "rubygems"
require "nokogiri"
require "open-uri"
require 'mail'

#email default settings for Gmail SMTP
options = { :address              => "smtp.gmail.com",
            :port                 => 587,
            :user_name            => 'okeefm57',
            :password             => '3mdh7TXIMA',
            :authentication       => 'plain',
            :enable_starttls_auto => true  }
Mail.defaults do
	delivery_method :smtp, options
end

#Production emails
#emails = ["mikeco57@gmail.com", "6034934692@vzwpix.com", "freedombot@jcsteven.com", "2625016576@mms.att.net"]

#emails
emails = ["mikeco57@gmail.com", "okeefm57@gmail.com"]

#products
products = ["21556265", "17128628", "16783170", "16783169", "17175595", "17133655", "17474538", "21638833", "16930265", "16930246", "22027232", "17617401", "21694972", "17128629", "16930262", "16817298", "22027233", "21556238", "17757334"]

#zip codes
zips = {"mikeco57@gmail.com" => "12180", "okeefm57@gmail.com" => "03051", "mdokeefe57@gmail.com" =>"03051"}

#time settings
time = Time.new

old_stock = if File.exists?('/home/okeefm/code/walmart_scraper/stock_settings.txt') and !File.zero?('/home/okeefm/code/walmart_scraper/stock_settings.txt')
		File.open('/home/okeefm/code/walmart_scraper/stock_settings.txt') do |file|
			Marshal.load(file)
		end
	else
		Hash.new
	end
stock = Hash.new


zips.each do |email, zip|
	customer_details = Hash.new
	products.each do |product|
		#grab the page as Nokogiri HTML
		page = Nokogiri::HTML(open("http://mobile.walmart.com/m/searchfindinstoreresults?product_id=" + product + "&zip=" + zip, "User-Agent" => "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.22 (KHTML, like Gecko) Ubuntu Chromium/25.0.1364.160 Chrome/25.0.1364.160 Safari/537.22"))
		
		#search for the tds that are the right color for being in stock
		stores = page.css("table.store")
		item = page.css("div.title").first.text
		#puts page
		instockstores = []
		if email == "mdokeefe57@gmail.com"
			store = stores.first
			if store.css("tr td").first.text == "In stock"
				instockstores.push(store.css("td.name span").text + " (" + store.css("td[colspan='2']").first.text + ")")
			end
		else
			stores.each do |store|
				if store.css("tr td").first.text == "In stock"
					instockstores.push(store.css("td.name span").text + " (" + store.css("td[colspan='2']").first.text + ")")
				end
			end
		end
		customer_details[item] = instockstores if instockstores.length > 0
	end
	stock[email] = customer_details
end

if stock.length > 0
	stock.each do |e, s| 
		if s != old_stock[e]
			body_str = "The following products were listed as 'in stock' at the following stores at " + time.strftime("%H:%M:%S") + ":\n"
				s.each do |item, stores|
					body_str += item + "\n"
					stores.each do |store|
						body_str += store + "\n"
					end
					body_str += "\n"
				end
			mail = Mail.new do
				from "okeefm57@gmail.com"
				to e
				subject "[walmart_bot] stock summary"
				body body_str
			end
			mail.charset = 'utf-8'
			mail.deliver
		end
	end
end

File.open('/home/okeefm/code/walmart_scraper/stock_settings.txt', 'w') do |file|
	Marshal.dump(stock, file)
end

#heartbeat email
#if (time.min == 0)
	mail = Mail.new do
		from "okeefm57@gmail.com"
		to "mikeco57@gmail.com"
		subject "[walmart_bot] is alive"
		body "The cron job running walmart_bot is alive, as of " + time.strftime("%H:%M:%S")
	end
	
	mail.charset = 'utf-8'
	mail.deliver
#end

