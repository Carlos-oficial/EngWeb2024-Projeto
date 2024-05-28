from typing import Dict


class SessionSingleton:
    _instance = None

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super().__new__(cls, *args, **kwargs)
            cls._instance._session = {}
        return cls._instance

    @staticmethod
    def get_session() -> Dict[str, str]:
        return SessionSingleton()._session

    def set(self, **kwargs):
        self._instance._session = self._instance._session | kwargs

    def remove(self, *keys):
        for key in keys:
            self._instance._session.pop(key)


# Usage:
session = SessionSingleton.get_session()
