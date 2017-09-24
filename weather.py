import requests
import cherrypy
import json
from ftplib import FTP
import xml.etree.ElementTree as ET

class App(object):
    @cherrypy.expose
    def index(self):
        obs = Observation()
        f = Forecast()
        obs.load()
        f.load()
        pkg = {'obs': obs.now, 'today': f.today, 'tomorrow': f.tomorrow}
        return json.dumps(pkg)

class Observation(object):
    def load(self):
        r = requests.get('http://reg.bom.gov.au/fwo/IDN60903/IDN60903.94926.json')
        self.now = r.json()['observations']['data'][0]

class Forecast(object):
    bom_server = 'ftp.bom.gov.au'
    bom_forcast_dir = 'anon/gen/fwo'
    bom_nsw_forcast_file = 'IDN11060.xml'
    buf = ''

    def load(self):
        ftp = FTP(self.bom_server)
        ftp.login()
        ftp.cwd(self.bom_forcast_dir)
        ftp.retrlines('RETR ' + self.bom_nsw_forcast_file, self.bufferlines)
        ftp.quit()
        self.parsebuf()

    def parsebuf(self):
        tree = ET.fromstring(self.buf)
        node = tree.find(".//area[@aac='NSW_PT027']")
        self.today = self.day(node[0])
        self.tomorrow = self.day(node[1])

    def day(self, node):
        forecast = {}
        forecast['icon'] = self.getattrib(node, "./element[@type='forecast_icon_code']")
        forecast['preciprange'] = self.getattrib(node, "./element[@type='precipitation_range']")
        forecast['tempmin'] = self.getattrib(node, "./element[@type='air_temperature_minimum']")
        forecast['tempmax'] = self.getattrib(node, "./element[@type='air_temperature_maximum']")
        forecast['precis'] = self.getattrib(node, "./text[@type='precis']")
        forecast['precip'] = self.getattrib(node, "./text[@type='probability_of_precipitation']")
        return forecast

    def getattrib(self, node, path):
        attrib = node.find(path)
        if attrib == None:
            return ''
        return attrib.text
        
    def bufferlines(self, line):
        self.buf += line

cherrypy.quickstart(App(), '/weather')
