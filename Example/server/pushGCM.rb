require 'rubygems'
require 'pushmeup'
GCM.host = 'https://android.googleapis.com/gcm/send'
GCM.format = :json
GCM.key = "AIzaSyDLp6tb6daAt89mqOlwuJXWrYbasva5PNw"
destination = ["APA91bGa-XNpgyo5bRc8ffP7DksbhyZ-IyXdyY_MX8Dh22D-ZYhZWbaC6E3HdGUoDqPGPB7E7eaf-gMZm1wg_HCRFPKSVcYkAwkAQStPdQf4W0rkYHzyzX78UaITvyrQL_-UAd8lY24i2v_-SgCA7HWH_l67G_rvVg"]
data = {:message => "Test!", :msgcnt => "1", :soundname => "beep.wav"}

GCM.send_notification( destination, data)
