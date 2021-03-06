#!/usr/bin/env python3

#            ---------------------------------------------------
#                             Proton Framework              
#            ---------------------------------------------------
#                Copyright (C) <2019-2020>  <Entynetproject>
#
#        This program is free software: you can redistribute it and/or modify
#        it under the terms of the GNU General Public License as published by
#        the Free Software Foundation, either version 3 of the License, or
#        any later version.
#
#        This program is distributed in the hope that it will be useful,
#        but WITHOUT ANY WARRANTY; without even the implied warranty of
#        MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
#        GNU General Public License for more details.
#
#        You should have received a copy of the GNU General Public License
#        along with this program.  If not, see <http://www.gnu.org/licenses/>.

import threading
import time

import core.session

''' Periodically checks if sessions are alive '''
class Extant(object):

    def __init__(self, shell):
        self.shell = shell
        self.check_alive_timer = None
        self.check()

    def check(self):
        if self.check_alive_timer is not None:
            self.check_alive_timer.cancel()

        self.check_alive_timer = threading.Timer(1.0, self.check)
        self.check_alive_timer.daemon = True
        self.check_alive_timer.start()

        now = time.time()

        max_delta = 10

        for skey, session in self.shell.sessions.items():
            delta = now - session.last_active
            #delta = datetime.timedelta(seconds=int(delta))

            if session.status == core.session.Session.ALIVE:
                if delta > max_delta:
                    self.shell.play_sound('TIMEOUT')
                    session.set_dead()
            else:
                if delta < max_delta:
                    self.shell.play_sound('RECONNECT')
                    session.set_reconnect()
